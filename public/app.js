// Configuration & Global State
const API_URL = "http://192.168.29.93:5001/api";

let currentUser = null;
let currentCurrency = { code: "USD", symbol: "$", rate: 1.0 };
let pendingBankTransfer = null;
let isBalanceHidden = false;

let currentLanguage = localStorage.getItem("virelia_language") || "en";

const translations = {
  en: {
    bank_name: "VIRELIA Bank",
    tagline: "Next-Generation Digital Banking",
    welcome_back: "Welcome Back",
    sign_in_subtitle: "Sign in to access your secure account dashboard.",
    email_address: "Email address",
    password: "Password",
    remember_email: "Remember email",
    forgot_password: "Forgot password?",
    sign_in: "Sign In",
    dont_have_account: "Don't have an account?",
    create_account_link: "Create account",

    create_account_title: "Create Account",
    create_account_subtitle: "Open your VIRELIA online banking profile in minutes.",
    personal_information: "Personal Information",
    first_name: "First Name",
    last_name: "Last Name",
    username: "Username",
    email: "Email Address",
    phone: "Phone Number",
    dob: "Date of Birth",
    country: "Country",
    select_country: "Select country",
    address: "Residential Address",
    secure_account: "Secure your account",
    secure_account_subtitle: "Choose a strong password to protect your account.",
    password_hint: "Use at least 8 characters.",
    confirm_password: "Confirm password",
    profile_picture: "Profile picture",
    upload_photo: "Upload profile photo",
    choose_clear_image: "Choose a clear profile image.",
    agree_terms: "I agree to the Terms of Service and Privacy Policy.",
    create_account_btn: "Create Account",
    already_have_account: "Already have an account?",
    sign_in_link: "Sign in",

    notifications: "Notifications",
    mark_all_read: "Mark all read",
    all_caught_up: "You're all caught up.",
    welcome_text: "Welcome back,",
    view_profile: "View Profile",
    language: "Language / Idioma",
    change_currency: "Change Currency",
    toggle_balance: "Toggle Balance",
    toggle_theme: "Toggle Theme",
    logout: "Logout",

    account_overview: "ACCOUNT OVERVIEW",
    dashboard_title: "Your finances, simplified.",
    dashboard_subtitle: "Monitor your accounts, move money securely and stay in control of your financial activity.",
    make_transfer: "⇄ Make a Transfer",

    account_security: "Account Security",
    protected: "Protected",
    verification: "Verification",
    pending_review: "Pending review",
    last_login: "Last login",
    just_now: "Just now",
    profile_completion: "Profile completion",

    total_balance: "Total Balance",
    display_currency: "Display currency:",
    available_funds: "Available funds",
    balance_updated: "Your balance is updated automatically after completed transactions.",
    view_accounts: "View accounts →",

    your_money: "YOUR MONEY",
    your_accounts: "Your Accounts",
    accounts_description: "View your balances and account details in one place.",
    loading_accounts: "Loading accounts...",

    quick_actions: "QUICK ACTIONS",
    move_money: "Move your money",
    move_money_description: "Fast, secure transfers whenever you need them.",
    between_accounts: "Between Accounts",
    between_accounts_sub: "Move money between your VIRELIA accounts",
    send_to_user: "Send to VIRELIA User",
    send_to_user_sub: "Transfer instantly to another VIRELIA member",
    bank_transfer: "Bank Transfer",
    bank_transfer_sub: "Send money to an external bank account",
    add_money: "Add Money",
    add_money_sub: "Fund your VIRELIA account",

    transfer: "TRANSFER",
    transfer_between: "Transfer Between Accounts",
    transfer_description: "Review your details carefully before continuing.",
    transfer_type: "Transfer type",
    between_my_accounts: "Between My Accounts",
    internal_transfer: "Internal Transfer",
    bank_transfer_option: "Bank Transfer",
    from: "From",
    to: "To",
    select_account: "Select account",
    recipient_email: "Recipient email",
    recipient_hint: "The recipient must be a registered VIRELIA member.",
    recipient_name: "Recipient name",
    account_number: "Account number",
    bank_name_field: "Bank name",
    amount: "Amount",
    description: "Description",
    optional: "Optional",
    transfer_security: "Your transfer will be verified before it is processed.",
    continue_transfer: "Continue Transfer",

    activity: "ACTIVITY",
    recent_transactions: "Recent Transactions",
    activity_description: "Keep track of money coming in and going out.",
    refresh: "↻ Refresh",
    all: "All",
    incoming: "Incoming",
    outgoing: "Outgoing",
    pending: "Pending",
    view_all_transactions: "View All Transactions",

    analytics: "ANALYTICS",
    financial_overview: "Financial Overview",
    analytics_description: "Understand how money moves through your accounts.",
    money_in: "Money In",
    money_out: "Money Out",
    net_flow: "Net Flow",
    total_transactions: "Total Transactions",
    transaction_trends: "Transaction Trends",
    money_movement: "Your recent money movement.",

    insights: "INSIGHTS",
    financial_snapshot: "Your financial snapshot",
    insights_description: "Smart insights based on your account activity.",
    spending_activity: "Spending activity",
    spending_insight: "Your spending insights will appear as transactions are added.",
    cash_flow: "Cash flow",
    cash_flow_insight: "Track your incoming and outgoing money.",
    account_protection: "Account protection",
    protection_insight: "Keep your account secure and never share verification codes.",

    home: "Home",
    transfer_nav: "Transfer",
    activity_nav: "Activity",
    profile: "Profile",

    account: "ACCOUNT",
    your_profile: "Your Profile",
    member_since: "Member Since",
    account_status: "Account Status",
    verification_status: "Verification Status",

    display_settings: "DISPLAY SETTINGS",
    select_currency: "Select Currency",
    currency_description: "Choose the currency used to display your account values.",

    language_eyebrow: "LANGUAGE / IDIOMA",
    select_language: "Select Language / Seleccionar Idioma",
    language_description: "Choose your preferred display language / Elija su idioma preferido.",

    transaction: "TRANSACTION",
    transaction_receipt: "Transaction Receipt",
    print_receipt: "🖨️ Print Receipt"
  },

  es: {
    bank_name: "Banco VIRELIA",
    tagline: "Banca Digital de Nueva Generación",
    welcome_back: "Bienvenido de nuevo",
    sign_in_subtitle: "Inicia sesión para acceder a tu panel bancario seguro.",
    email_address: "Correo electrónico",
    password: "Contraseña",
    remember_email: "Recordar correo",
    forgot_password: "¿Olvidaste tu contraseña?",
    sign_in: "Iniciar sesión",
    dont_have_account: "¿No tienes una cuenta?",
    create_account_link: "Crear cuenta",

    create_account_title: "Crear Cuenta",
    create_account_subtitle: "Abre tu perfil bancario VIRELIA en minutos.",
    personal_information: "Información Personal",
    first_name: "Nombre",
    last_name: "Apellido",
    username: "Nombre de usuario",
    email: "Correo Electrónico",
    phone: "Número de Teléfono",
    dob: "Fecha de Nacimiento",
    country: "País",
    select_country: "Seleccionar país",
    address: "Dirección Residencial",
    secure_account: "Protege tu cuenta",
    secure_account_subtitle: "Elige una contraseña segura para proteger tu cuenta.",
    password_hint: "Usa al menos 8 caracteres.",
    confirm_password: "Confirmar contraseña",
    profile_picture: "Foto de perfil",
    upload_photo: "Subir foto de perfil",
    choose_clear_image: "Elige una imagen clara.",
    agree_terms: "Acepto los Términos de Servicio y la Política de Privacidad.",
    create_account_btn: "Crear Cuenta",
    already_have_account: "¿Ya tienes una cuenta?",
    sign_in_link: "Iniciar sesión",

    notifications: "Notificaciones",
    mark_all_read: "Marcar todo como leído",
    all_caught_up: "No tienes notificaciones nuevas.",
    welcome_text: "Bienvenido de nuevo,",
    view_profile: "Ver Perfil",
    language: "Idioma / Language",
    change_currency: "Cambiar Moneda",
    toggle_balance: "Mostrar/Ocultar Saldo",
    toggle_theme: "Cambiar Tema",
    logout: "Cerrar sesión",

    account_overview: "RESUMEN DE CUENTA",
    dashboard_title: "Tus finanzas, simplificadas.",
    dashboard_subtitle: "Supervisa tus cuentas, mueve dinero de forma segura y mantén el control de tu actividad financiera.",
    make_transfer: "⇄ Hacer una Transferencia",

    account_security: "Seguridad de la Cuenta",
    protected: "Protegida",
    verification: "Verificación",
    pending_review: "Pendiente de revisión",
    last_login: "Último acceso",
    just_now: "Ahora mismo",
    profile_completion: "Perfil completado",

    total_balance: "Saldo Total",
    display_currency: "Moneda mostrada:",
    available_funds: "Fondos disponibles",
    balance_updated: "Tu saldo se actualiza automáticamente después de las transacciones completadas.",
    view_accounts: "Ver cuentas →",

    your_money: "TU DINERO",
    your_accounts: "Tus Cuentas",
    accounts_description: "Consulta tus saldos y detalles de cuenta en un solo lugar.",
    loading_accounts: "Cargando cuentas...",

    quick_actions: "ACCIONES RÁPIDAS",
    move_money: "Mueve tu dinero",
    move_money_description: "Transferencias rápidas y seguras cuando las necesites.",
    between_accounts: "Entre Cuentas",
    between_accounts_sub: "Mueve dinero entre tus cuentas VIRELIA",
    send_to_user: "Enviar a Usuario VIRELIA",
    send_to_user_sub: "Transfiere al instante a otro miembro de VIRELIA",
    bank_transfer: "Transferencia Bancaria",
    bank_transfer_sub: "Envía dinero a una cuenta bancaria externa",
    add_money: "Añadir Dinero",
    add_money_sub: "Deposita fondos en tu cuenta VIRELIA",

    transfer: "TRANSFERENCIA",
    transfer_between: "Transferir Entre Cuentas",
    transfer_description: "Revisa cuidadosamente los datos antes de continuar.",
    transfer_type: "Tipo de transferencia",
    between_my_accounts: "Entre Mis Cuentas",
        internal_transfer: "Transferencia Interna",
    bank_transfer_option: "Transferencia Bancaria",
    from: "Desde",
    to: "Para",
    select_account: "Seleccionar cuenta",
    recipient_email: "Correo electrónico del destinatario",
    recipient_hint: "El destinatario debe ser un miembro registrado de VIRELIA.",
    recipient_name: "Nombre del destinatario",
    account_number: "Número de cuenta",
    bank_name_field: "Nombre del banco",
    amount: "Cantidad",
    description: "Descripción",
    optional: "Opcional",
    transfer_security: "Tu transferencia será verificada antes de ser procesada.",
    continue_transfer: "Continuar Transferencia",

    activity: "ACTIVIDAD",
    recent_transactions: "Transacciones Recientes",
    activity_description: "Mantén un registro del dinero que entra y sale.",
    refresh: "↻ Actualizar",
    all: "Todas",
    incoming: "Entrantes",
    outgoing: "Salientes",
    pending: "Pendientes",
    view_all_transactions: "Ver Todas las Transacciones",

    analytics: "ANÁLISIS",
    financial_overview: "Resumen Financiero",
    analytics_description: "Comprende cómo se mueve el dinero en tus cuentas.",
    money_in: "Dinero Entrante",
    money_out: "Dinero Saliente",
    net_flow: "Flujo Neto",
    total_transactions: "Transacciones Totales",
    transaction_trends: "Tendencias de Transacciones",
    money_movement: "Tu movimiento reciente de dinero.",

    insights: "INFORMACIÓN",
    financial_snapshot: "Tu resumen financiero",
    insights_description: "Información inteligente basada en la actividad de tu cuenta.",
    spending_activity: "Actividad de gastos",
    spending_insight: "Tus datos de gastos aparecerán a medida que se agreguen transacciones.",
    cash_flow: "Flujo de efectivo",
    cash_flow_insight: "Controla el dinero que entra y sale.",
    account_protection: "Protección de cuenta",
    protection_insight: "Mantén tu cuenta segura y nunca compartas códigos de verificación.",

    home: "Inicio",
    transfer_nav: "Transferencia",
    activity_nav: "Actividad",
    profile: "Perfil",

    account: "CUENTA",
    your_profile: "Tu Perfil",
    member_since: "Miembro Desde",
    account_status: "Estado de la Cuenta",
    verification_status: "Estado de Verificación",

    display_settings: "CONFIGURACIÓN DE PANTALLA",
    select_currency: "Seleccionar Moneda",
    currency_description: "Elige la moneda utilizada para mostrar los valores de tu cuenta.",

    language_eyebrow: "IDIOMA / LANGUAGE",
    select_language: "Seleccionar Idioma / Select Language",
    language_description: "Elija su idioma preferido / Choose your preferred display language.",

    transaction: "TRANSACCIÓN",
    transaction_receipt: "Recibo de Transacción",
    print_receipt: "🖨️ Imprimir Recibo"
  }
};

function applyLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("virelia_language", lang);

  const dictionary = translations[lang] || translations.en;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");

    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");

    if (dictionary[key]) {
      element.setAttribute("placeholder", dictionary[key]);
    }
  });

  const languageCode = document.getElementById("currentLanguageCode");

  if (languageCode) {
    languageCode.textContent = lang.toUpperCase();
  }

  document.querySelectorAll(".language-item").forEach((item) => {
    item.classList.toggle(
      "active",
      item.dataset.lang === lang
    );
  });
}

function escapeHTML(str) {
  if (!str) return "";

  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMoneyInCurrency(amount) {
  const numericAmount = Number(amount) || 0;
  const convertedAmount = numericAmount * currentCurrency.rate;

  return `${currentCurrency.symbol}${convertedAmount.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  )}`;
}

function getAuthHeaders() {
  const token = localStorage.getItem("virelia_token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : ""
  };
}

function showMessage(element, message, type = "info") {
  if (!element) {
    console.log(message);
    return;
  }

  element.textContent = message;
  element.className = `message ${type}`;

  setTimeout(() => {
    element.textContent = "";
    element.className = "message";
  }, 4000);
}

function updateActivationState(user) {
  const isActivated = Boolean(user.is_activated || user.isActivated);
  if (currentUser) currentUser.isActivated = isActivated ? 1 : 0;
  localStorage.setItem("virelia_activated", isActivated ? "1" : "0");
}

// ==========================================
// Notification System
// ==========================================

function addNotification(message, type = "info") {
  const notificationCount = document.getElementById("notificationCount");
  const notificationList = document.getElementById("notificationList");

  if (!notificationCount || !notificationList) return;

  // Update notification count badge
  let count = parseInt(notificationCount.textContent) || 0;
  count++;
  notificationCount.textContent = count;
  notificationCount.style.display = "flex";

  // Remove empty state message if it exists
  const emptyNotification = notificationList.querySelector(".empty-notification");
  if (emptyNotification) {
    emptyNotification.remove();
  }

  // Create notification item
  const notificationItem = document.createElement("div");
  notificationItem.className = "notification-item unread";

  notificationItem.innerHTML = `
    <div class="notification-message">${escapeHTML(message)}</div>
    <div class="notification-time">${new Date().toLocaleString()}</div>
  `;

  // Add notification to the top of the list
  notificationList.prepend(notificationItem);
}

function showAuthScreen() {
  document.getElementById("authScreen")?.classList.add("active");
  document.getElementById("dashboardScreen")?.classList.remove("active");
}

function showDashboardScreen() {
  document.getElementById("authScreen")?.classList.remove("active");
  document.getElementById("dashboardScreen")?.classList.add("active");
}

function showLoginBox() {
  document.getElementById("loginBox")?.classList.remove("hidden");
  document.getElementById("registerBox")?.classList.add("hidden");
}

function showRegisterBox() {
  document.getElementById("loginBox")?.classList.add("hidden");
  document.getElementById("registerBox")?.classList.remove("hidden");
}

// ==========================================
// Theme Toggle
// ==========================================

function initTheme() {
  const savedTheme = localStorage.getItem("virelia_theme");

  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");

    const themeToggle = document.getElementById("themeToggle");

    if (themeToggle) {
      themeToggle.textContent = "☀️";
    }
  }
}

function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme");

  if (currentTheme === "dark") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("virelia_theme", "light");

    const themeToggle =
      document.getElementById("themeToggle");

    if (themeToggle) {
      themeToggle.textContent = "🌙";
    }
  } else {
    document.documentElement.setAttribute(
      "data-theme",
      "dark"
    );

    localStorage.setItem(
      "virelia_theme",
      "dark"
    );

    const themeToggle =
      document.getElementById("themeToggle");

    if (themeToggle) {
      themeToggle.textContent = "☀️";
    }
  }
}


// ==========================================
// Hide Balance
// ==========================================

function toggleBalanceVisibility() {
  isBalanceHidden = !isBalanceHidden;

  localStorage.setItem(
    "virelia_hide_balance",
    isBalanceHidden
  );

  const balanceElements =
    document.querySelectorAll(
      ".balance-amount, .account-balance, .analytics-value"
    );

  balanceElements.forEach((el) => {
    if (isBalanceHidden) {
      el.classList.add("balance-hidden");
    } else {
      el.classList.remove("balance-hidden");
    }
  });

  const hideBalanceBtn =
    document.getElementById("hideBalanceBtn");

  if (hideBalanceBtn) {
    hideBalanceBtn.textContent =
      isBalanceHidden ? "🙈" : "👁️";
  }

  const balanceToggleCardBtn =
    document.getElementById(
      "balanceToggleCardBtn"
    );

  if (balanceToggleCardBtn) {
    balanceToggleCardBtn.textContent =
      isBalanceHidden ? "🙈" : "👁️";
  }
}


// ==========================================
// Profile Modal
// ==========================================

function openProfileModal() {
  if (!currentUser) return;

  const modalProfilePicture =
    document.getElementById(
      "modalProfilePicture"
    );

  if (modalProfilePicture) {
    const picUrl =
      currentUser.profilePicture ||
      currentUser.profile_picture;

    if (picUrl) {
      modalProfilePicture.src = picUrl;
      modalProfilePicture.style.display =
        "block";
    } else {
      modalProfilePicture.style.display =
        "none";
    }
  }

  const modalName =
    document.getElementById("modalName");

  const modalEmail =
    document.getElementById("modalEmail");

  const modalPhone =
    document.getElementById("modalPhone");

  const modalUsername =
    document.getElementById("modalUsername");

  const modalDob =
    document.getElementById("modalDob");

  const modalAddress =
    document.getElementById("modalAddress");

  if (modalName) {
    modalName.textContent =
      currentUser.name || "";
  }

  if (modalEmail) {
    modalEmail.textContent =
      currentUser.email || "";
  }

  if (modalPhone) {
    modalPhone.textContent =
      currentUser.phone || "Not provided";
  }

  if (modalUsername) {
    modalUsername.textContent =
      currentUser.username || "Not set";
  }

  if (modalDob) {
    modalDob.textContent =
      currentUser.dateOfBirth ||
      currentUser.date_of_birth ||
      "Not provided";
  }

  if (modalAddress) {
    modalAddress.textContent =
      currentUser.address ||
      "Not provided";
  }

  const modalAccountStatus =
    document.getElementById(
      "modalAccountStatus"
    );

  if (modalAccountStatus) {
    modalAccountStatus.textContent =
      currentUser.isActivated
        ? "Activated"
        : "Not Activated";
  }

  const modalVerificationStatus =
    document.getElementById(
      "modalVerificationStatus"
    );

  if (modalVerificationStatus) {
    modalVerificationStatus.textContent =
      currentUser.isActivated
        ? "Verified"
        : "Pending";
  }

  document
    .getElementById("profileModal")
    ?.classList.remove("hidden");
}


// ==========================================
// Session Management
// ==========================================

async function restoreSession() {
  const token =
    localStorage.getItem(
      "virelia_token"
    );

  if (!token) {
    showAuthScreen();
    showLoginBox();
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/me`,
      {
        headers: getAuthHeaders()
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      logout();
      return;
    }

    currentUser = data.user;

    updateActivationState(
      data.user
    );

    await loadDashboard();
  } catch (error) {
    console.error(
      "Session restoration failed:",
      error
    );

    logout();
  }
}

function logout() {
  localStorage.removeItem(
    "virelia_token"
  );

  localStorage.removeItem(
    "virelia_activated"
  );

  currentUser = null;

  showAuthScreen();
  showLoginBox();
}


// ==========================================
// Dashboard Loading
// ==========================================

async function loadDashboard() {
  if (!currentUser) return;

  showDashboardScreen();

  const userNameEl =
    document.getElementById(
      "userName"
    );

  if (userNameEl) {
    userNameEl.textContent =
      currentUser.name || "User";
  }

  const profilePicture =
    document.getElementById(
      "profilePicture"
    );

  if (profilePicture) {
    const picUrl =
      currentUser.profilePicture ||
      currentUser.profile_picture;

    if (picUrl) {
      profilePicture.src = picUrl;
      profilePicture.style.display =
        "block";
    } else {
      profilePicture.style.display =
        "none";
    }
  }

  const accountStatusBadge =
    document.getElementById(
      "accountStatusBadge"
    );

  if (accountStatusBadge) {
    if (currentUser.isActivated) {
      accountStatusBadge.textContent =
        "✓ Activated";

      accountStatusBadge.className =
        "account-status-badge activated";
    } else {
      accountStatusBadge.textContent =
        "⚠ Not Activated";

      accountStatusBadge.className =
        "account-status-badge not-activated";
    }
  }

  try {
    const [
      accountsRes,
      txRes
    ] = await Promise.all([
      fetch(
        `${API_URL}/accounts`,
        {
          headers:
            getAuthHeaders()
        }
      ),

      fetch(
        `${API_URL}/transactions`,
        {
          headers:
            getAuthHeaders()
        }
      )
    ]);

    if (accountsRes.ok) {
      const accountsData =
        await accountsRes.json();

      renderAccounts(
        accountsData.accounts || []
      );

      const totalBalanceEl =
        document.getElementById(
          "totalBalance"
        );

      if (totalBalanceEl) {
        totalBalanceEl.textContent =
          formatMoneyInCurrency(
            accountsData.totalBalance || 0
          );
      }
      const balanceUserName = document.getElementById("balanceUserName");
      if (balanceUserName) {
        balanceUserName.textContent = currentUser.name || "User";
      }
    }

    if (txRes.ok) {
      const txData =
        await txRes.json();

      renderTransactions(
        txData
      );
    }
  } catch (error) {
    console.error(
      "Failed to load dashboard data:",
      error
    );
  }
}


// ==========================================
// Render Accounts
// ==========================================

function renderAccounts(accounts) {
  const accountsContainer =
    document.getElementById(
      "accountsContainer"
    );

  const balanceAccountsContainer =
    document.getElementById(
      "balanceAccountsContainer"
    );

  const fromAccountSelect =
    document.getElementById(
      "fromAccount"
    );

  const toAccountSelect =
    document.getElementById(
      "toAccount"
    );

  // Render accounts INSIDE balance card
  if (balanceAccountsContainer) {
    balanceAccountsContainer.innerHTML =
      accounts
        .map(
          (acc) => `
            <div class="balance-account-chip">
              <div class="account-type">
                ${escapeHTML(
                  acc.type ||
                  "Checking"
                )}
              </div>

              <div class="account-number">
                **** ${escapeHTML(
                  String(
                    acc.number ||
                    acc.account_number
                  ).slice(-4)
                )}
              </div>

              <div class="account-balance">
                ${formatMoneyInCurrency(
                  acc.balance
                )}
              </div>
            </div>
          `
        )
        .join("");
  }

  // Render accounts in accounts section
  if (accountsContainer) {
    accountsContainer.innerHTML =
      accounts
        .map(
          (acc) => `
            <div class="account-card">
              <div class="account-type">
                ${escapeHTML(
                  acc.type ||
                  "Checking"
                )}
              </div>

              <div class="account-number">
                **** ${escapeHTML(
                  String(
                    acc.number ||
                    acc.account_number
                  ).slice(-4)
                )}
              </div>

              <div class="account-balance">
                ${formatMoneyInCurrency(
                  acc.balance
                )}
              </div>
            </div>
          `
        )
        .join("");
  }

  const accountOptions =
    accounts
      .map(
        (acc) => `
          <option value="${acc.id}">
            ${escapeHTML(
              acc.type
            )}
            (****${String(
              acc.number ||
              acc.account_number
            ).slice(-4)})
          </option>
        `
      )
      .join("");

  if (fromAccountSelect) {
    fromAccountSelect.innerHTML = `
      <option value="">
        Select account
      </option>
      ${accountOptions}
    `;
  }

  if (toAccountSelect) {
    toAccountSelect.innerHTML = `
      <option value="">
        Select account
      </option>
      ${accountOptions}
    `;
  }
}

// ==========================================
// Render Transactions
// ==========================================

function renderTransactions(transactions) {
  const transactionsContainer =
    document.getElementById(
      "transactionsContainer"
    );

  if (!transactionsContainer) return;

  if (
    !transactions ||
    transactions.length === 0
  ) {
    transactionsContainer.innerHTML = `
      <div class="empty-state">
        No transactions found.
      </div>
    `;

    return;
  }

  transactionsContainer.innerHTML =
    transactions
      .slice(0, 10)
      .map((tx) => `
        <div
          class="transaction-item"
          data-transaction-id="${tx.id}"
          role="button"
          tabindex="0"
          title="View transaction receipt"
        >
          <div class="transaction-left">
            <div class="transaction-desc">
              ${escapeHTML(
                tx.description ||
                tx.type
              )}
            </div>

            <div class="transaction-date">
              ${new Date(
                tx.date ||
                tx.created_at
              ).toLocaleDateString()}
            </div>
          </div>

          <div class="transaction-right">
            <div class="transaction-amount ${
              Number(tx.amount) > 0
                ? "positive"
                : "negative"
            }">
              ${
                Number(tx.amount) > 0
                  ? "+"
                  : "-"
              }${formatMoneyInCurrency(
                Math.abs(
                  tx.amount
                )
              )}
            </div>

            <span
              class="transaction-status ${(
                tx.status ||
                "completed"
              ).toLowerCase()}"
            >
              ${escapeHTML(
                tx.status ||
                "Completed"
              )}
            </span>
          </div>
        </div>
      `)
      .join("");

  // ========================================
  // Transaction Receipt Click
  // ========================================

  document
    .querySelectorAll(
      ".transaction-item[data-transaction-id]"
    )
    .forEach((transactionItem) => {

      const openReceipt =
        async () => {

          const transactionId =
            transactionItem.dataset
              .transactionId;

          try {
            const response =
              await fetch(
                `${API_URL}/transactions/${transactionId}/receipt`,
                {
                  headers:
                    getAuthHeaders()
                }
              );

            const data =
              await response.json();

            if (!response.ok) {
              showMessage(
                null,
                data.error ||
                  "Unable to load receipt.",
                "error"
              );

              return;
            }

            const receiptModal =
              document.getElementById(
                "receiptModal"
              );

            const receiptDetails =
              document.getElementById(
                "receiptDetails"
              );

            if (
              !receiptModal ||
              !receiptDetails
            ) {
              console.error(
                "Receipt window is missing."
              );

              return;
            }

            receiptDetails.innerHTML = `
              <div class="receipt-row">
                <strong>
                  Transaction
                </strong>

                <span>
                  #${escapeHTML(
                    String(data.id)
                  )}
                </span>
              </div>

              <div class="receipt-row">
                <strong>
                  Account
                </strong>

                <span>
                  ${escapeHTML(
                    data.account_type ||
                    ""
                  )}
                </span>
              </div>

              <div class="receipt-row">
                <strong>
                  Account Number
                </strong>

                <span>
                  ${escapeHTML(
                    data.account_number ||
                    ""
                  )}
                </span>
              </div>

              <div class="receipt-row">
                <strong>
                  Description
                </strong>

                <span>
                  ${escapeHTML(
                    data.description ||
                    "Transaction"
                  )}
                </span>
              </div>

              <div class="receipt-row">
                <strong>
                  Amount
                </strong>

                <span>
                  ${formatMoneyInCurrency(
                    Math.abs(
                      Number(
                        data.amount ||
                        0
                      )
                    )
                  )}
                </span>
              </div>

              <div class="receipt-row">
                <strong>
                  Status
                </strong>

                <span>
                  ${escapeHTML(
                    data.status ||
                    "Completed"
                  )}
                </span>
              </div>

              <div class="receipt-row">
                <strong>
                  Date
                </strong>

                <span>
                  ${new Date(
                    data.created_at ||
                    data.date
                  ).toLocaleString()}
                </span>
              </div>
            `;

            receiptModal.classList.remove(
              "hidden"
            );

          } catch (error) {
            console.error(
              "Receipt error:",
              error
            );

            console.error(
              "Unable to load transaction receipt."
            );
          }
        };

      transactionItem.addEventListener(
        "click",
        openReceipt
      );

      transactionItem.addEventListener(
        "keydown",
        (event) => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            openReceipt();
          }

        }
      );
    });
}


// ==========================================
// Transfer Form
// ==========================================

function updateTransferForm() {
  const transferType =
    document.getElementById(
      "transferType"
    )?.value;

  const toAccountGroup =
    document.getElementById(
      "toAccountGroup"
    );

  const recipientGroup =
    document.getElementById(
      "recipientGroup"
    );

  const bankFields =
    document.getElementById(
      "bankFields"
    );

  if (toAccountGroup) {
    toAccountGroup.classList.add(
      "hidden"
    );
  }

  if (recipientGroup) {
    recipientGroup.classList.add(
      "hidden"
    );
  }

  if (bankFields) {
    bankFields.classList.add(
      "hidden"
    );
  }

  if (transferType === "internal") {

    if (toAccountGroup) {
      toAccountGroup.classList.remove(
        "hidden"
      );
    }

  } else if (transferType === "user") {

    if (recipientGroup) {
      recipientGroup.classList.remove(
        "hidden"
      );
    }

  } else if (transferType === "bank") {

    if (bankFields) {
      bankFields.classList.remove(
        "hidden"
      );
    }
  }
}

// ==========================================
// Event Listeners
// ==========================================

const languageModal = document.getElementById("languageModal");
const languageBtn = document.getElementById("languageBtn");
const settingsLanguageBtn = document.getElementById("settingsLanguageBtn");
const closeLanguageBtn = document.getElementById("closeLanguageBtn");

function openLanguageModal() {
  languageModal?.classList.remove("hidden");
}

languageBtn?.addEventListener("click", openLanguageModal);

settingsLanguageBtn?.addEventListener("click", () => {
  document.getElementById("settingsDropdown")?.classList.add("hidden");
  openLanguageModal();
});

closeLanguageBtn?.addEventListener("click", () => {
  languageModal?.classList.add("hidden");
});

document.querySelectorAll(".language-item").forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.lang);
    languageModal?.classList.add("hidden");
  });
});

applyLanguage(currentLanguage);

document.addEventListener("DOMContentLoaded", () => {
  
  initTheme();

  // Show/Hide Login/Register
  document.getElementById("showRegister")?.addEventListener("click", (e) => {
    e.preventDefault();
    showRegisterBox();
  });

  document.getElementById("showLogin")?.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginBox();
  });

  // Password toggles
  document.querySelectorAll(".password-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.passwordTarget;
      const input = document.getElementById(targetId);

      if (input) {
        input.type = input.type === "password" ? "text" : "password";
        btn.textContent = input.type === "password" ? "👁️" : "🙈";
      }
    });
  });

  // Profile picture preview
  document.getElementById("regPicture")?.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (ev) => {
        const preview = document.getElementById("registerPreview");

        if (preview) {
          preview.src = ev.target.result;
          preview.classList.remove("hidden");
        }
      };

      reader.readAsDataURL(file);
    }
  });

  // THEME
  document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);

  document.getElementById("settingsThemeBtn")?.addEventListener("click", () => {
    toggleTheme();
    document.getElementById("settingsDropdown")?.classList.add("hidden");
  });

  // CURRENCY
  document.getElementById("currencyBtn")?.addEventListener("click", () => {
    document.getElementById("currencyModal")?.classList.remove("hidden");
  });

  document.getElementById("settingsCurrencyBtn")?.addEventListener("click", () => {
    document.getElementById("currencyModal")?.classList.remove("hidden");
    document.getElementById("settingsDropdown")?.classList.add("hidden");
  });

  document.getElementById("closeCurrencyBtn")?.addEventListener("click", () => {
    document.getElementById("currencyModal")?.classList.add("hidden");
  });

  document.querySelectorAll(".currency-item").forEach((item) => {
    item.addEventListener("click", () => {
      currentCurrency = {
        code: item.dataset.currency,
        symbol: item.dataset.symbol,
        rate: parseFloat(item.dataset.rate)
      };

      localStorage.setItem(
        "virelia_currency",
        JSON.stringify(currentCurrency)
      );

      const currentCurrencyEl = document.getElementById("currentCurrency");

      if (currentCurrencyEl) {
        currentCurrencyEl.textContent = currentCurrency.symbol;
      }

      const transferCurrencySymbol =
        document.getElementById("transferCurrencySymbol");

      if (transferCurrencySymbol) {
        transferCurrencySymbol.textContent = currentCurrency.symbol;
      }

      const balanceCurrencyCode =
        document.getElementById("balanceCurrencyCode");

      if (balanceCurrencyCode) {
        balanceCurrencyCode.textContent = currentCurrency.code;
      }

      document.getElementById("currencyModal")?.classList.add("hidden");

      if (currentUser) {
        loadDashboard();
      }
    });
  });

  // LANGUAGE
  document.getElementById("languageBtn")?.addEventListener("click", () => {
    document.getElementById("languageModal")?.classList.remove("hidden");
  });

  document.getElementById("settingsLanguageBtn")?.addEventListener("click", () => {
    document.getElementById("languageModal")?.classList.remove("hidden");
    document.getElementById("settingsDropdown")?.classList.add("hidden");
  });

  document.getElementById("closeLanguageBtn")?.addEventListener("click", () => {
    document.getElementById("languageModal")?.classList.add("hidden");
  });

  // HIDE BALANCE
  document.getElementById("hideBalanceBtn")?.addEventListener(
    "click",
    toggleBalanceVisibility
  );

  document.getElementById("settingsHideBalanceBtn")?.addEventListener(
    "click",
    () => {
      toggleBalanceVisibility();
      document.getElementById("settingsDropdown")?.classList.add("hidden");
    }
  );

  document.getElementById("balanceToggleCardBtn")?.addEventListener(
    "click",
    toggleBalanceVisibility
  );

  // SETTINGS
  document.getElementById("settingsBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();

    document
      .getElementById("settingsDropdown")
      ?.classList.toggle("hidden");
  });

  document.getElementById("settingsProfileBtn")?.addEventListener("click", () => {
    document.getElementById("settingsDropdown")?.classList.add("hidden");
    openProfileModal();
  });

  document.getElementById("settingsLogoutBtn")?.addEventListener("click", () => {
    document.getElementById("settingsDropdown")?.classList.add("hidden");
    logout();
  });

  document.addEventListener("click", (e) => {
    const settingsDropdown =
      document.getElementById("settingsDropdown");

    if (
      settingsDropdown &&
      !settingsDropdown.classList.contains("hidden") &&
      !settingsDropdown.contains(e.target) &&
      e.target.id !== "settingsBtn"
    ) {
      settingsDropdown.classList.add("hidden");
    }
  });

  // NOTIFICATIONS
  document.getElementById("notificationBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();

    document
      .getElementById("notificationDropdown")
      ?.classList.toggle("hidden");
  });

  // PROFILE
  document.getElementById("profileBtn")?.addEventListener(
    "click",
    openProfileModal
  );

  document.getElementById("mobileProfileBtn")?.addEventListener(
    "click",
    openProfileModal
  );

  document.getElementById("closeProfileBtn")?.addEventListener("click", () => {
    document.getElementById("profileModal")?.classList.add("hidden");
  });

  // LOGIN
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail")?.value;
    const password = document.getElementById("loginPassword")?.value;

    const submitBtn = loginForm.querySelector(
      'button[type="submit"]'
    );

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Signing In...";
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          loginError,
          data.error || "Login failed.",
          "error"
        );
        return;
      }

      localStorage.setItem("virelia_token", data.token);

      currentUser = data.user;

      updateActivationState(data.user);

      loginForm.reset();

      addNotification("Welcome back!", "success");

      await loadDashboard();

    } catch (error) {
      showMessage(
        loginError,
        "Unable to connect to server.",
        "error"
      );

    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Sign In";
      }
    }
  });

    // REGISTER
  const registerForm = document.getElementById("registerForm");
    const registerError = document.getElementById("registerError");
  const registerSuccess = document.getElementById("registerSuccess");

  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName =
      document.getElementById("regFirstName")?.value.trim() || "";

    const lastName =
      document.getElementById("regLastName")?.value.trim() || "";

    const name = `${firstName} ${lastName}`.trim();

    const username =
      document.getElementById("regUsername")?.value.trim() || "";

    const email =
      document.getElementById("regEmail")?.value.trim().toLowerCase() || "";

    const phone =
      document.getElementById("regPhone")?.value.trim() || "";

    const password =
      document.getElementById("regPassword")?.value || "";

    const confirmPassword =
      document.getElementById("regConfirmPassword")?.value || "";

    const dateOfBirth =
      document.getElementById("regDob")?.value || "";

    const country =
      document.getElementById("regCountry")?.value || "";

    const address =
      document.getElementById("regAddress")?.value.trim() || "";

    const profilePictureFile =
      document.getElementById("regPicture")?.files[0];

    const agreeTerms =
      document.getElementById("agreeTerms")?.checked;

    const submitBtn =
      registerForm.querySelector('button[type="submit"]');

    if (!firstName || !lastName) {
      showMessage(
        registerError,
        "Please enter your first and last name.",
        "error"
      );
      return;
    }

    if (password.length < 8) {
      showMessage(
        registerError,
        "Password must be at least 8 characters.",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      showMessage(
        registerError,
        "Passwords do not match.",
        "error"
      );
      return;
    }

    if (!agreeTerms) {
      showMessage(
        registerError,
        "Please agree to the Terms of Service.",
        "error"
      );
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Creating Account...";
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("username", username);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("country", country);
      formData.append("address", address);

      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          registerError,
          data.error || "Registration failed.",
          "error"
        );
        return;
      }

      showMessage(
        registerSuccess,
        "Registration successful! Please log in.",
        "success"
      );

      registerForm.reset();

      setTimeout(() => {
        showLoginBox();

        const loginEmailInput =
          document.getElementById("loginEmail");

        if (loginEmailInput) {
          loginEmailInput.value = email;
        }
      }, 2000);

    } catch (error) {
      showMessage(
        registerError,
        "Unable to connect to server.",
        "error"
      );

    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Create Account";
      }
    }
  });

  // TRANSFER

  const transferType =
    document.getElementById("transferType");

  transferType?.addEventListener(
    "change",
    updateTransferForm
  );

  const transferForm =
    document.getElementById("transferForm");

  const transferMessage =
    document.getElementById("transferMessage");

  transferForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const type =
      transferType?.value || "internal";

    const fromAccountId =
      document.getElementById("fromAccount")?.value;

    const toAccountId =
      document.getElementById("toAccount")?.value;

    const amount =
      parseFloat(
        document.getElementById("transferAmount")?.value
      );

    const description =
      document.getElementById("transferDesc")?.value || "";

    if (!fromAccountId) {
      showMessage(
        transferMessage,
        "Please select the source account.",
        "error"
      );
      return;
    }

    if (!amount || amount <= 0) {
      showMessage(
        transferMessage,
        "Please enter a valid amount.",
        "error"
      );
      return;
    }

    if (type === "internal" && !toAccountId) {
      showMessage(
        transferMessage,
        "Please select the destination account.",
        "error"
      );
      return;
    }

    if (type === "bank") {
      const recipient =
        document.getElementById("bankRecipient")?.value;

      const accountNumber =
        document.getElementById("bankAccount")?.value;

      const bankName =
        document.getElementById("bankName")?.value;

      if (!recipient || !accountNumber || !bankName) {
        showMessage(
          transferMessage,
          "Please complete all bank transfer details.",
          "error"
        );
        return;
      }

      if (!currentUser?.isActivated) {
        pendingBankTransfer = {
          type,
          fromAccountId,
          toAccountId,
          amount,
          description,
          recipient,
          accountNumber,
          bankName
        };

        document
          .getElementById("activationModal")
          ?.classList.remove("hidden");

        return;
      }

      pendingBankTransfer = {
        type,
        fromAccountId,
        toAccountId,
        amount,
        description,
        recipient,
        accountNumber,
        bankName
      };

      document
        .getElementById("transferCodeModal")
        ?.classList.remove("hidden");

      return;
    }

    const submitBtn =
      transferForm.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Processing...";
    }

    try {
      const endpoint =
        type === "user"
          ? "/transfer/member"
          : "/transfer";

      const body =
        type === "user"
          ? {
              fromAccountId,
              recipientEmail:
                document.getElementById("recipientEmail")?.value,
              amount,
              description
            }
          : {
              fromAccountId,
              toAccountId,
              amount,
              description
            };

      const response = await fetch(
        `${API_URL}${endpoint}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(body)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          transferMessage,
          data.error || "Transfer failed.",
          "error"
        );
        return;
      }

      showMessage(
        transferMessage,
        "Transfer completed successfully!",
        "success"
      );

      
      transferForm.reset();

      updateTransferForm();



      addNotification("Transfer completed successfully!", "success");


      await loadDashboard();

    } catch (error) {
      showMessage(
        transferMessage,
        "Unable to execute transfer.",
        "error"
      );

    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Continue Transfer";
      }
    }
  });

    // ACTIVATION
  document.getElementById("activateNowBtn")?.addEventListener("click", () => {
    document.getElementById("activationModal")?.classList.add("hidden");
    document.getElementById("activationCodeModal")?.classList.remove("hidden");
  });

  document.getElementById("closeActivationBtn")?.addEventListener("click", () => {
    document.getElementById("activationModal")?.classList.add("hidden");
  });

  document.getElementById("closeActivationCodeBtn")?.addEventListener("click", () => {
    document.getElementById("activationCodeModal")?.classList.add("hidden");
  });

  document.getElementById("submitActivationBtn")?.addEventListener("click", async () => {
    const code = document.getElementById("activationCode")?.value.trim();
    const activationError = document.getElementById("activationError");

    if (!code) {
      showMessage(
        activationError,
        "Please enter your activation code.",
        "error"
      );
      return;
    }

    const response = await fetch(`${API_URL}/activate`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ activationCode: code })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(
        activationError,
        data.error || "Invalid activation code.",
        "error"
      );
      return;
    }

    if (currentUser) {
      currentUser.isActivated = 1;
    }

    localStorage.setItem("virelia_activated", "1");

    document.getElementById("activationCodeModal")?.classList.add("hidden");

    const activationCodeInput = document.getElementById("activationCode");
    if (activationCodeInput) {
      activationCodeInput.value = "";
    }

    document
      .getElementById("activationSuccessModal")
      ?.classList.remove("hidden");
  });

  document.getElementById("continueTransferBtn")?.addEventListener("click", () => {
    document
      .getElementById("activationSuccessModal")
      ?.classList.add("hidden");

    document
      .getElementById("transferCodeModal")
      ?.classList.remove("hidden");
  });

    // TRANSFER CODE
  document.getElementById("closeTransferCodeBtn")?.addEventListener("click", () => {
    document
      .getElementById("transferCodeModal")
      ?.classList.add("hidden");
  });

  document.getElementById("submitTransferCodeBtn")?.addEventListener("click", async () => {
    const code = document.getElementById("transferCode")?.value.trim();
    const transferCodeError = document.getElementById("transferCodeError");

    if (!code) {
      showMessage(
        transferCodeError,
        "Please enter your transfer code.",
        "error"
      );
      return;
    }

    if (!pendingBankTransfer) {
      showMessage(
        transferCodeError,
        "No pending transfer found.",
        "error"
      );
      return;
    }

    const response = await fetch(`${API_URL}/transfer/bank`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...pendingBankTransfer,
        authCode: code
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(
        transferCodeError,
        data.error || "Transfer failed.",
        "error"
      );
      return;
    }

    document
      .getElementById("transferCodeModal")
      ?.classList.add("hidden");

    const transferCodeInput = document.getElementById("transferCode");
    if (transferCodeInput) {
      transferCodeInput.value = "";
    }

    const refEl = document.getElementById("transferReference");
    if (refEl) {
      refEl.textContent = data.transactionId || Date.now();
    }

    document
      .getElementById("transferSuccessModal")
      ?.classList.remove("hidden");

    pendingBankTransfer = null;

    const transferForm = document.getElementById("transferForm");
    if (transferForm) {
      transferForm.reset();
    }

    updateTransferForm();

    addNotification("Account activated successfully!", "success");

    await loadDashboard();
  });

  document.getElementById("closeTransferSuccessBtn")?.addEventListener("click", () => {
    document
      .getElementById("transferSuccessModal")
      ?.classList.add("hidden");
  });

    // CLOSE MODALS
  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".modal")?.classList.add("hidden");
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  });

    // LOGOUT & REFRESH
  document.getElementById("logoutBtn")?.addEventListener("click", logout);
  document.getElementById("refreshDashboardBtn")?.addEventListener("click", loadDashboard);

  document.getElementById("refreshTransactionsBtn")?.addEventListener("click", async () => {
    const txRes = await fetch(`${API_URL}/transactions`, {
      headers: getAuthHeaders()
    });

    if (txRes.ok) {
      const txData = await txRes.json();
      renderTransactions(txData);
    }
  });

    // QUICK ACTIONS
  document.querySelectorAll(".quick-action").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.transferType;

      if (type) {
        const transferTypeSelect = document.getElementById("transferType");

        if (transferTypeSelect) {
          transferTypeSelect.value = type;
          updateTransferForm();

          document
            .getElementById("transferSection")
            ?.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

    // DASHBOARD TRANSFER BUTTON
  document.getElementById("dashboardTransferBtn")?.addEventListener("click", () => {
    document
      .getElementById("transferSection")
      ?.scrollIntoView({ behavior: "smooth" });
  });

    // MOBILE NAV
  document.getElementById("mobileHomeBtn")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("mobileTransferBtn")?.addEventListener("click", () => {
    document
      .getElementById("transferSection")
      ?.scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("mobileActivityBtn")?.addEventListener("click", () => {
    document
      .querySelector(".transactions-section")
      ?.scrollIntoView({ behavior: "smooth" });
  });
  
    // PRINT RECEIPT
  document.getElementById("printReceiptBtn")?.addEventListener("click", () => {
    const receiptDetails = document.getElementById("receiptDetails");

    if (!receiptDetails) {
      console.error("Receipt details are missing.");
      return;
    }

    const printWindow = window.open("", "_blank", "width=800,height=900");

    if (!printWindow) {
      alert("Please allow pop-ups in your browser to print the receipt.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>VIRELIA Bank - Transaction Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #ffffff;
            color: #111111;
            padding: 40px;
            margin: 0;
          }

          .receipt {
            max-width: 650px;
            margin: 0 auto;
            border: 1px solid #dddddd;
            border-radius: 12px;
            padding: 30px;
          }

          h1 {
            text-align: center;
            margin: 0 0 8px;
          }

          .subtitle {
            text-align: center;
            margin-bottom: 30px;
            color: #666666;
          }

          .receipt-row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding: 14px 0;
            border-bottom: 1px solid #eeeeee;
          }

          .receipt-row strong {
            font-weight: 600;
          }

          .receipt-row span {
            text-align: right;
          }

          .footer {
            text-align: center;
            margin-top: 30px;
            color: #777777;
            font-size: 12px;
          }

          @media print {
            body {
              padding: 0;
            }

            .receipt {
              border: none;
              max-width: none;
            }
          }
        </style>
      </head>

      <body>
        <div class="receipt">
          <h1>VIRELIA Bank</h1>
          <div class="subtitle">Transaction Receipt</div>

          ${receiptDetails.innerHTML}

          <div class="footer">
            Thank you for banking with VIRELIA Bank.
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  });

  // INITIALIZE
  updateTransferForm();
  restoreSession();
});