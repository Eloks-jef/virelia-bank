require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5001;

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET;
const ACTIVATION_CODE = process.env.ACTIVATION_CODE;
const TRANSFER_CODE = process.env.TRANSFER_CODE;

if (!JWT_SECRET || !ADMIN_SECRET || !ACTIVATION_CODE || !TRANSFER_CODE) {
  console.error('❌ Missing required environment variables.');
  process.exit(1);
}

// ===== HELPER FUNCTIONS =====

// Timing-safe comparison to mitigate timing attacks on secret codes
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Rounds numeric inputs to 2 decimal places to prevent floating-point drift
function formatAmount(amount) {
  return Math.round(Number(amount) * 100) / 100;
}

// Generates full 10-digit unique account numbers
function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'data', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// ===== DATABASE (TURSO / LIBSQL) =====
const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

console.log('🗄️ Connected to Turso cloud database.');

// Helper functions to keep your existing code working
async function runQuery(sql, params = []) {
  const result = await db.execute({ sql, args: params });
  return { lastID: result.lastInsertRowid, changes: result.rowsAffected };
}

async function getQuery(sql, params = []) {
  const result = await db.execute({ sql, args: params });
  return result.rows[0];
}

async function allQuery(sql, params = []) {
  const result = await db.execute({ sql, args: params });
  return result.rows;
}

// ===== CREATE TABLES =====
async function setupDatabase() {
  try {
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        phone TEXT,
        date_of_birth TEXT,
        country TEXT,
        address TEXT,
        profile_picture TEXT,
        is_activated INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        balance REAL NOT NULL DEFAULT 0,
        number TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'Completed',
        recipient_name TEXT,
        recipient_account TEXT,
        recipient_bank TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(id)
      )
    `);
    
    console.log('✅ Tables created/verified on Turso.');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
}

setupDatabase();

// ===== AUTH MIDDLEWARE =====
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Please log in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Your session is invalid or has expired.' });
    }
    req.user = user;
    next();
  });
}

// ===== ADMIN MIDDLEWARE =====
function authenticateAdmin(req, res, next) {
  const adminKey = req.headers['admin-key'];
  
  if (!safeCompare(adminKey, ADMIN_SECRET)) {
    return res.status(403).json({ error: 'Access denied. Admin access only.' });
  }
  
  next();
}

// =================================================
// REGISTER
// =================================================
app.post('/api/register', upload.single('profilePicture'), async (req, res) => {
  const { name, username, email, password, phone, dateOfBirth, country, address } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !email || !password || !phone || !dateOfBirth || !address) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    const existingUser = await getQuery('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existingUser) {
      return res.status(400).json({ error: 'An account already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await runQuery(
      'INSERT INTO users (name, username, email, password, phone, date_of_birth, country, address, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name.trim(), username?.trim() || null, email.toLowerCase(), hashedPassword, phone, dateOfBirth, country, address, profilePicture]
    );

    const userId = result.lastID;
    const checkingNumber = generateAccountNumber();
    let savingsNumber = generateAccountNumber();
    while (savingsNumber === checkingNumber) {
      savingsNumber = generateAccountNumber();
    }

    await runQuery("INSERT INTO accounts (user_id, type, balance, number) VALUES (?, 'Checking', 0, ?)", [userId, checkingNumber]);
    await runQuery("INSERT INTO accounts (user_id, type, balance, number) VALUES (?, 'Savings', 0, ?)", [userId, savingsNumber]);

    res.status(201).json({ message: 'Your VIRELIA Bank account has been created successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while creating your account.' });
  }
});

// =================================================
// LOGIN
// =================================================
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await getQuery('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = createToken(user);

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.date_of_birth,
        country: user.country,
        address: user.address,
        profilePicture: user.profile_picture,
        isActivated: user.is_activated,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while logging in.' });
  }
});

// =================================================
// GET USER PROFILE
// =================================================
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const user = await getQuery(
      'SELECT id, name, username, email, phone, date_of_birth, country, address, profile_picture, is_activated, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load profile.' });
  }
});

// =================================================
// ACTIVATE ACCOUNT
// =================================================
app.post('/api/activate', authenticateToken, async (req, res) => {
  const { activationCode } = req.body;

  if (!safeCompare(activationCode, ACTIVATION_CODE)) {
    return res.status(400).json({ error: 'Invalid activation code. Please contact VIRELIA Bank for assistance.' });
  }

  try {
    await runQuery('UPDATE users SET is_activated = 1 WHERE id = ?', [req.user.id]);
    res.json({ message: 'Your account has been successfully activated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not activate account.' });
  }
});

// =================================================
// VERIFY TRANSFER CODE
// =================================================
app.post('/api/verify-transfer-code', authenticateToken, (req, res) => {
  const { transferCode } = req.body;

  if (!safeCompare(transferCode, TRANSFER_CODE)) {
    return res.status(400).json({ error: 'Invalid transfer code. Please contact VIRELIA Bank for assistance.' });
  }

  res.json({ message: 'Transfer code verified successfully.' });
});

// =================================================
// GET USER ACCOUNTS
// =================================================
app.get('/api/accounts', authenticateToken, async (req, res) => {
  try {
    const accounts = await allQuery(
      'SELECT id, type, balance, number, created_at FROM accounts WHERE user_id = ? ORDER BY id ASC',
      [req.user.id]
    );

    const totalBalance = accounts.reduce((total, account) => total + account.balance, 0);

    res.json({ accounts, totalBalance: formatAmount(totalBalance) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load accounts.' });
  }
});

// =================================================
// INTERNAL TRANSFER (Between User's Own Accounts)
// =================================================
app.post('/api/transfer', authenticateToken, async (req, res) => {
  const { fromAccountId, toAccountId, amount, description } = req.body;
  const transferAmount = formatAmount(amount);

  if (!Number.isInteger(Number(fromAccountId)) || !Number.isInteger(Number(toAccountId)) || !Number.isFinite(transferAmount) || transferAmount <= 0) {
    return res.status(400).json({ error: 'Invalid transfer details.' });
  }

  if (Number(fromAccountId) === Number(toAccountId)) {
    return res.status(400).json({ error: 'You cannot transfer money to the same account.' });
  }

  try {
    await runQuery('BEGIN IMMEDIATE');

    const fromAccount = await getQuery('SELECT * FROM accounts WHERE id = ? AND user_id = ?', [fromAccountId, req.user.id]);
    if (!fromAccount) {
      await runQuery('ROLLBACK');
      return res.status(400).json({ error: 'Source account not found.' });
    }

    if (Number(fromAccount.balance) < transferAmount) {
      await runQuery('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient funds.' });
    }

    const toAccount = await getQuery('SELECT * FROM accounts WHERE id = ? AND user_id = ?', [toAccountId, req.user.id]);
    if (!toAccount) {
      await runQuery('ROLLBACK');
      return res.status(400).json({ error: 'Destination account not found.' });
    }

    await runQuery('UPDATE accounts SET balance = ROUND(balance - ?, 2) WHERE id = ?', [transferAmount, fromAccountId]);
    await runQuery('UPDATE accounts SET balance = ROUND(balance + ?, 2) WHERE id = ?', [transferAmount, toAccountId]);

    await runQuery('INSERT INTO transactions (account_id, type, description, amount, status) VALUES (?, ?, ?, ?, ?)', [fromAccountId, 'transfer', description?.trim() || 'Internal Transfer', -transferAmount, 'Completed']);
    await runQuery('INSERT INTO transactions (account_id, type, description, amount, status) VALUES (?, ?, ?, ?, ?)', [toAccountId, 'transfer', description?.trim() || 'Internal Transfer', transferAmount, 'Completed']);

    await runQuery('COMMIT');
    res.json({ message: 'Transfer completed successfully.' });

  } catch (error) {
    console.error('Internal transfer error:', error);
    try { await runQuery('ROLLBACK'); } catch (e) {}
    res.status(500).json({ error: 'Transfer failed. No money was moved.' });
  }
});

// =================================================
// INTERNAL TRANSFER (To Another Member)
// =================================================
app.post('/api/transfer/member', authenticateToken, async (req, res) => {
  const { fromAccountId, recipientEmail, amount, description } = req.body;
  const transferAmount = formatAmount(amount);

  if (!Number.isInteger(Number(fromAccountId)) || !recipientEmail || !Number.isFinite(transferAmount) || transferAmount <= 0) {
    return res.status(400).json({ error: 'Invalid transfer details.' });
  }

  try {
    await runQuery('BEGIN IMMEDIATE');

    const recipient = await getQuery('SELECT id, name FROM users WHERE email = ?', [recipientEmail.trim().toLowerCase()]);
    if (!recipient) {
      await runQuery('ROLLBACK');
      return res.status(400).json({ error: 'Recipient not found. Please check the email address.' });
    }

    if (recipient.id === req.user.id) {
      await runQuery('ROLLBACK');
      return res.status(400).json({ error: 'You cannot transfer money to yourself.' });
    }

    const fromAccount = await getQuery('SELECT * FROM accounts WHERE id = ? AND user_id = ?', [fromAccountId, req.user.id]);
    if (!fromAccount) {
      await runQuery('ROLLBACK');
      return res.status(400).json({ error: 'Source account not found.' });
    }

    if (Number(fromAccount.balance) < transferAmount) {
      await runQuery('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient funds.' });
    }

    const toAccount = await getQuery('SELECT * FROM accounts WHERE user_id = ? AND type = ? LIMIT 1', [recipient.id, 'Checking']);
    if (!toAccount) {
      await runQuery('ROLLBACK');
      return res.status(400).json({ error: 'Recipient account not found.' });
    }

    await runQuery('UPDATE accounts SET balance = ROUND(balance - ?, 2) WHERE id = ?', [transferAmount, fromAccountId]);
    await runQuery('UPDATE accounts SET balance = ROUND(balance + ?, 2) WHERE id = ?', [transferAmount, toAccount.id]);

    await runQuery('INSERT INTO transactions (account_id, type, description, amount, status) VALUES (?, ?, ?, ?, ?)', [fromAccountId, 'transfer', description?.trim() || `Transfer to ${recipient.name}`, -transferAmount, 'Completed']);
    await runQuery('INSERT INTO transactions (account_id, type, description, amount, status) VALUES (?, ?, ?, ?, ?)', [toAccount.id, 'transfer', description?.trim() || `Transfer from ${req.user.name}`, transferAmount, 'Completed']);

    await runQuery('COMMIT');
    res.json({ message: 'Transfer completed successfully.' });

  } catch (error) {
    console.error('Member transfer error:', error);
    try { await runQuery('ROLLBACK'); } catch (e) {}
    res.status(500).json({ error: 'Transfer failed. No money was moved.' });
  }
});

// =================================================
// BANK TRANSFER (External) - Creates Pending Transaction
// =================================================
app.post('/api/transfer/bank', authenticateToken, async (req, res) => {
  const { fromAccountId, recipient, accountNumber, bankName, amount, description } = req.body;
  const transferAmount = formatAmount(amount);

  if (!fromAccountId || !recipient || !accountNumber || !bankName || !Number.isFinite(transferAmount) || transferAmount <= 0) {
    return res.status(400).json({ error: 'Invalid transfer details.' });
  }

  try {
    await runQuery('BEGIN IMMEDIATE');

    const user = await getQuery('SELECT is_activated FROM users WHERE id = ?', [req.user.id]);
    if (!user || !user.is_activated) {
      await runQuery('ROLLBACK');
      return res.status(403).json({ error: 'Your account has not been activated yet.', requiresActivation: true });
    }

    const fromAccount = await getQuery('SELECT * FROM accounts WHERE id = ? AND user_id = ?', [fromAccountId, req.user.id]);
    if (!fromAccount) {
      await runQuery('ROLLBACK');
      return res.status(400).json({ error: 'Source account not found.' });
    }

    if (Number(fromAccount.balance) < transferAmount) {
      await runQuery('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient funds.' });
    }

    await runQuery('UPDATE accounts SET balance = ROUND(balance - ?, 2) WHERE id = ?', [transferAmount, fromAccountId]);

    const result = await runQuery(
      'INSERT INTO transactions (account_id, type, description, amount, status, recipient_name, recipient_account, recipient_bank) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [fromAccountId, 'bank_transfer', description?.trim() || `Bank Transfer to ${recipient}`, -transferAmount, 'Pending', recipient, accountNumber, bankName]
    );

    await runQuery('COMMIT');

    res.json({
      message: 'Bank transfer initiated successfully.',
      status: 'pending',
      transactionId: result.lastID
    });

  } catch (error) {
    console.error('Bank transfer error:', error);
    try { await runQuery('ROLLBACK'); } catch (e) {}
    res.status(500).json({ error: 'Transfer failed.' });
  }
});

// =================================================
// GET TRANSACTION RECEIPT
// =================================================
app.get('/api/transactions/:id/receipt', authenticateToken, async (req, res) => {
  try {
    const transaction = await getQuery(
      `SELECT transactions.*, accounts.type as account_type, accounts.number as account_number, users.name as user_name, users.email as user_email
       FROM transactions
       INNER JOIN accounts ON transactions.account_id = accounts.id
       INNER JOIN users ON accounts.user_id = users.id
       WHERE transactions.id = ? AND users.id = ?`,
      [req.params.id, req.user.id]
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load receipt.' });
  }
});

// =================================================
// GET TRANSACTIONS
// =================================================
app.get('/api/transactions', authenticateToken, async (req, res) => {
  const { accountId } = req.query;

  let query = `
    SELECT transactions.id, transactions.account_id, transactions.type, transactions.description,
           transactions.amount, transactions.status, transactions.recipient_name,
           transactions.recipient_account, transactions.recipient_bank, transactions.created_at as date
    FROM transactions
    INNER JOIN accounts ON transactions.account_id = accounts.id
    WHERE accounts.user_id = ?
  `;

  const params = [req.user.id];

  if (accountId) {
    query += ' AND transactions.account_id = ?';
    params.push(accountId);
  }

  query += ' ORDER BY transactions.created_at DESC';

  try {
    const transactions = await allQuery(query, params);
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load transactions.' });
  }
});

// =================================================
// ANALYTICS
// =================================================
app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const transactions = await allQuery(
      `SELECT transactions.type, transactions.amount, transactions.status, transactions.created_at as date
       FROM transactions
       INNER JOIN accounts ON transactions.account_id = accounts.id
       WHERE accounts.user_id = ?
       ORDER BY transactions.created_at ASC`,
      [req.user.id]
    );

    let moneyIn = 0;
    let moneyOut = 0;
    let pendingCount = 0;
    let completedCount = 0;

    transactions.forEach(transaction => {
      const amount = Number(transaction.amount);
      if (transaction.status === 'Pending') pendingCount++;
      else completedCount++;
      if (amount > 0) moneyIn += amount;
      else moneyOut += Math.abs(amount);
    });

    const monthlyTrends = {};
    transactions.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyTrends[month]) {
        monthlyTrends[month] = { month, moneyIn: 0, moneyOut: 0, totalTransactions: 0 };
      }
      const amount = Number(transaction.amount);
      if (amount > 0) monthlyTrends[month].moneyIn += amount;
      else monthlyTrends[month].moneyOut += Math.abs(amount);
      monthlyTrends[month].totalTransactions++;
    });

    const trends = Object.values(monthlyTrends).slice(-6).map(t => ({
      ...t,
      moneyIn: formatAmount(t.moneyIn),
      moneyOut: formatAmount(t.moneyOut)
    }));

    res.json({
      totalMoneyIn: formatAmount(moneyIn),
      totalMoneyOut: formatAmount(moneyOut),
      totalTransactions: transactions.length,
      pendingTransactions: pendingCount,
      completedTransactions: completedCount,
      netFlow: formatAmount(moneyIn - moneyOut),
      monthlyTrends: trends
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load analytics.' });
  }
});

// =================================================
// ADMIN ROUTES
// =================================================

app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await allQuery(
      `SELECT users.id, users.name, users.username, users.email, users.phone, users.date_of_birth,
              users.country, users.address, users.profile_picture, users.is_activated, users.created_at
       FROM users ORDER BY users.created_at DESC`
    );

    const userIds = users.map(u => u.id);
    if (userIds.length === 0) return res.json([]);

    const placeholders = userIds.map(() => '?').join(',');
    const accounts = await allQuery(`SELECT * FROM accounts WHERE user_id IN (${placeholders})`, userIds);

    const usersWithAccounts = users.map(user => ({
      ...user,
      accounts: accounts.filter(acc => acc.user_id === user.id)
    }));

    res.json(usersWithAccounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load users.' });
  }
});

app.post('/api/admin/add-money', authenticateAdmin, async (req, res) => {
  const { accountId, amount, description } = req.body;
  const depositAmount = formatAmount(amount);

  if (!accountId || depositAmount <= 0) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  try {
    await runQuery('BEGIN IMMEDIATE');

    const account = await getQuery('SELECT id FROM accounts WHERE id = ?', [accountId]);
    if (!account) {
      await runQuery('ROLLBACK');
      return res.status(404).json({ error: 'Account not found.' });
    }

    await runQuery('UPDATE accounts SET balance = ROUND(balance + ?, 2) WHERE id = ?', [depositAmount, accountId]);
    await runQuery('INSERT INTO transactions (account_id, type, description, amount) VALUES (?, ?, ?, ?)', [accountId, 'deposit', description || 'Manual Deposit', depositAmount]);

    await runQuery('COMMIT');
    res.json({ message: `Successfully added $${depositAmount} to account ${accountId}.` });
  } catch (error) {
    console.error(error);
    try { await runQuery('ROLLBACK'); } catch (e) {}
    res.status(500).json({ error: 'Could not add money.' });
  }
});

app.post('/api/admin/remove-money', authenticateAdmin, async (req, res) => {
  const { accountId, amount, description } = req.body;
  const withdrawAmount = formatAmount(amount);

  if (!accountId || withdrawAmount <= 0) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  try {
    await runQuery('BEGIN IMMEDIATE');

    const account = await getQuery('SELECT balance FROM accounts WHERE id = ?', [accountId]);
    if (!account) {
      await runQuery('ROLLBACK');
      return res.status(404).json({ error: 'Account not found.' });
    }
    if (account.balance < withdrawAmount) {
      await runQuery('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient funds.' });
    }

    await runQuery('UPDATE accounts SET balance = ROUND(balance - ?, 2) WHERE id = ?', [withdrawAmount, accountId]);
    await runQuery('INSERT INTO transactions (account_id, type, description, amount) VALUES (?, ?, ?, ?)', [accountId, 'withdrawal', description || 'Manual Withdrawal', -withdrawAmount]);

    await runQuery('COMMIT');
    res.json({ message: `Successfully removed $${withdrawAmount} from account ${accountId}.` });
  } catch (error) {
    console.error(error);
    try { await runQuery('ROLLBACK'); } catch (e) {}
    res.status(500).json({ error: 'Could not remove money.' });
  }
});

app.post('/api/admin/set-balance', authenticateAdmin, async (req, res) => {
  const { accountId, balance, description } = req.body;
  const newBalance = formatAmount(balance);

  if (!accountId || balance === undefined || newBalance < 0) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  try {
    await runQuery('BEGIN IMMEDIATE');

    const account = await getQuery('SELECT balance FROM accounts WHERE id = ?', [accountId]);
    if (!account) {
      await runQuery('ROLLBACK');
      return res.status(404).json({ error: 'Account not found.' });
    }

    const difference = formatAmount(newBalance - account.balance);
    await runQuery('UPDATE accounts SET balance = ? WHERE id = ?', [newBalance, accountId]);

    if (difference !== 0) {
      await runQuery('INSERT INTO transactions (account_id, type, description, amount) VALUES (?, ?, ?, ?)', [accountId, difference > 0 ? 'deposit' : 'withdrawal', description || 'Balance Adjustment', difference]);
    }

    await runQuery('COMMIT');
    res.json({ message: `Balance set to $${newBalance} for account ${accountId}.` });
  } catch (error) {
    console.error(error);
    try { await runQuery('ROLLBACK'); } catch (e) {}
    res.status(500).json({ error: 'Could not update balance.' });
  }
});

// =================================================
// SERVER
// =================================================
app.listen(PORT, () => {
  console.log('');
  console.log('🏦 VIRELIA Bank is running.');
  console.log('🌐 http://localhost:' + PORT);
  console.log('🗄️ Persistent SQLite database enabled.');
  console.log('');
});