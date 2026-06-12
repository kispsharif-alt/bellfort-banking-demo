const state = {
  route: routeFromLocation(),
  methods: {
    receive: "card",
    send: "iban",
    crypto: "receive",
    asset: "BTC",
    convertSide: "from",
    convertFrom: "EUR",
    convertTo: "BTC"
  },
  result: null
};

const routes = {
  home: {
    title: "Client demo",
    render: renderHome
  },
  receive: {
    title: "Receive money",
    render: renderReceive
  },
  send: {
    title: "Send money",
    render: renderSend
  },
  convert: {
    title: "Convert",
    render: renderConvert
  },
  cards: {
    title: "Cards",
    render: renderCards
  },
  crypto: {
    title: "Crypto",
    render: renderCrypto
  },
  casino: {
    title: "Casino Window",
    render: renderCasino
  }
};

const receiveMethods = [
  ["card", "Card", "Credit or debit card"],
  ["sepa", "SEPA", "Euro bank transfer"],
  ["iban", "IBAN", "Dedicated payment reference"],
  ["bank", "Bank transfer", "Local account details"],
  ["crypto", "Crypto", "Wallet instruction"]
];

const sendMethods = [
  ["iban", "IBAN", "International payout"],
  ["sepa", "SEPA", "Euro payout"],
  ["bank", "Bank transfer", "Local beneficiary"],
  ["crypto", "Crypto", "Wallet withdrawal"]
];

const cryptoAssets = [
  ["BTC", "Bitcoin", "Bitcoin"],
  ["ETH", "Ethereum", "Ethereum"],
  ["USDT", "Tether USD", "TRC20 / ERC20"],
  ["SOL", "Solana", "Solana"],
  ["USDC", "USD Coin", "ERC20"]
];

const fiatCurrencies = [
  ["EUR", "🇪🇺", "Euro", "European Union", 1.08],
  ["USD", "🇺🇸", "US dollar", "United States", 1],
  ["GBP", "🇬🇧", "Pound sterling", "United Kingdom", 1.27],
  ["CHF", "🇨🇭", "Swiss franc", "Switzerland", 1.11],
  ["PLN", "🇵🇱", "Polish zloty", "Poland", 0.25],
  ["DKK", "🇩🇰", "Danish krone", "Denmark", 0.14],
  ["NOK", "🇳🇴", "Norwegian krone", "Norway", 0.095],
  ["SEK", "🇸🇪", "Swedish krona", "Sweden", 0.096],
  ["CZK", "🇨🇿", "Czech koruna", "Czechia", 0.043],
  ["HUF", "🇭🇺", "Hungarian forint", "Hungary", 0.0028],
  ["RON", "🇷🇴", "Romanian leu", "Romania", 0.22],
  ["BGN", "🇧🇬", "Bulgarian lev", "Bulgaria", 0.55],
  ["TRY", "🇹🇷", "Turkish lira", "Turkey", 0.031],
  ["AED", "🇦🇪", "UAE dirham", "United Arab Emirates", 0.27],
  ["CAD", "🇨🇦", "Canadian dollar", "Canada", 0.73],
  ["AUD", "🇦🇺", "Australian dollar", "Australia", 0.66],
  ["NZD", "🇳🇿", "New Zealand dollar", "New Zealand", 0.61],
  ["SGD", "🇸🇬", "Singapore dollar", "Singapore", 0.74],
  ["HKD", "🇭🇰", "Hong Kong dollar", "Hong Kong", 0.13],
  ["JPY", "🇯🇵", "Japanese yen", "Japan", 0.0067],
  ["CNY", "🇨🇳", "Chinese yuan", "China", 0.14],
  ["INR", "🇮🇳", "Indian rupee", "India", 0.012],
  ["BRL", "🇧🇷", "Brazilian real", "Brazil", 0.19],
  ["MXN", "🇲🇽", "Mexican peso", "Mexico", 0.054],
  ["ZAR", "🇿🇦", "South African rand", "South Africa", 0.054],
  ["KZT", "🇰🇿", "Kazakhstani tenge", "Kazakhstan", 0.0022],
  ["UAH", "🇺🇦", "Ukrainian hryvnia", "Ukraine", 0.025],
  ["GEL", "🇬🇪", "Georgian lari", "Georgia", 0.37],
  ["AMD", "🇦🇲", "Armenian dram", "Armenia", 0.0026],
  ["KGS", "🇰🇬", "Kyrgyzstani som", "Kyrgyzstan", 0.011]
];

const cryptoRates = {
  BTC: 65000,
  ETH: 3500,
  USDT: 1,
  SOL: 150,
  USDC: 1
};

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    event.preventDefault();
    navigate(routeButton.dataset.route);
    return;
  }

  const methodButton = event.target.closest("[data-method]");
  if (methodButton) {
    state.methods[methodButton.dataset.group] = methodButton.dataset.method;
    state.result = null;
    render();
    return;
  }

  const assetButton = event.target.closest("[data-asset]");
  if (assetButton) {
    state.methods.asset = assetButton.dataset.asset;
    state.result = null;
    render();
    return;
  }

  const convertSideButton = event.target.closest("[data-convert-side]");
  if (convertSideButton) {
    state.methods.convertSide = convertSideButton.dataset.convertSide;
    state.result = null;
    render();
    return;
  }

  const convertValueButton = event.target.closest("[data-convert-value]");
  if (convertValueButton) {
    const side = state.methods.convertSide;
    state.methods[side === "to" ? "convertTo" : "convertFrom"] = convertValueButton.dataset.convertValue;
    if (side === "from") state.methods.convertSide = "to";
    state.result = null;
    render();
  }
});

document.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form).entries());
  state.result = {
    type: form.dataset.flow,
    reference: `BB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    data
  };
  render();
});

window.addEventListener("popstate", () => {
  state.route = routeFromLocation();
  render();
});

render();

function routeFromLocation() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const segment = path.split("/").filter(Boolean).pop();
  if (segment === "payments") return "receive";
  if (segment === "send") return "send";
  if (segment === "convert") return "convert";
  if (segment === "cards") return "cards";
  if (segment === "crypto") return "crypto";
  if (segment === "casino-window") return "casino";
  return "home";
}

function navigate(route) {
  state.route = route;
  state.result = null;
  const path = {
    home: "",
    receive: "merchant/payments/",
    send: "merchant/send/",
    convert: "merchant/convert/",
    cards: "merchant/cards/",
    crypto: "merchant/crypto/",
    casino: "casino-window/"
  }[route] || "";
  const target = new URL(path, document.baseURI);
  history.pushState({}, "", target.pathname);
  render();
}

function render() {
  const active = routes[state.route] ? state.route : "home";
  state.route = active;
  document.querySelector("#page-title").textContent = routes[active].title;
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.classList.toggle("active", button.dataset.route === active);
  });
  document.querySelector("#view").innerHTML = routes[active].render();
}

function renderHome() {
  return `
    <section class="hero">
      <div class="hero-panel">
        <p class="eyebrow">Private payments / AI powered / Crypto enabled</p>
        <h2>One clean demo for money movement, cards, crypto, and merchant windows.</h2>
        <p>Use this static version for partner review. All screens are clickable and all forms create mock confirmations only.</p>
        <div class="hero-actions">
          <button class="primary" type="button" data-route="receive">Receive</button>
          <button class="secondary" type="button" data-route="send">Send</button>
          <button class="secondary" type="button" data-route="convert">Convert</button>
          <button class="secondary" type="button" data-route="cards">Cards</button>
          <button class="secondary" type="button" data-route="crypto">Crypto</button>
        </div>
      </div>

      <aside class="balance-panel">
        <p class="eyebrow">Demo balance</p>
        <h3>Available funds</h3>
        <div class="balance-total">EUR 48,250.00</div>
        <div class="balance-list">
          ${balanceRow("EUR", "36,800.00")}
          ${balanceRow("USD", "7,420.00")}
          ${balanceRow("GBP", "2,160.00")}
          ${balanceRow("USDC", "1,870.00")}
        </div>
      </aside>
    </section>

    <section class="grid feature-grid">
      ${featureCard("R", "Receive", "Card, SEPA, IBAN, bank transfer, and crypto instructions.", "receive")}
      ${featureCard("S", "Send", "IBAN, SEPA, local bank, and crypto payout requests.", "send")}
      ${featureCard("F", "Convert", "Fiat country currencies and crypto assets with one-click selection.", "convert")}
      ${featureCard("C", "Cards", "Virtual and physical card order demo with 3DS phone field.", "cards")}
      ${featureCard("X", "Crypto", "BTC, ETH, USDT, SOL, and USDC wallet request demo.", "crypto")}
      ${featureCard("W", "Casino Window", "Separate merchant window using confirmed internal payment only.", "casino")}
    </section>
  `;
}

function renderReceive() {
  const method = state.methods.receive;
  return pageLayout({
    heading: "Receive Money",
    text: "Create a clean payment instruction for the customer. This demo saves nothing and sends no request.",
    methods: methodButtons("receive", receiveMethods, method),
    form: `
      <form data-flow="receive">
        <div class="form-grid">
          ${field("Amount", "amount", "250.00")}
          ${select("Currency", "currency", ["EUR", "USD", "GBP", "CHF", "USDC"])}
          ${field("Customer name", "customerName", "Alex Client")}
          ${field("Customer email", "customerEmail", "client@example.com", "email")}
          ${receiveFields(method)}
          ${field("Reference", "reference", "INV-2026-001")}
        </div>
        <div class="form-actions">
          <button class="primary" type="submit">Create receive instruction</button>
          <span class="hint">Mock confirmation only</span>
        </div>
      </form>
    `,
    aside: summary("Receive", [
      ["Selected rail", labelFor(receiveMethods, method)],
      ["Compliance", "KYC/KYB required before real use"],
      ["Status", "Demo instruction ready"]
    ])
  });
}

function renderSend() {
  const method = state.methods.send;
  return pageLayout({
    heading: "Send Money",
    text: "Prepare a payout request with only the fields required for the selected route.",
    methods: methodButtons("send", sendMethods, method),
    form: `
      <form data-flow="send">
        <div class="form-grid">
          ${field("Recipient name", "recipientName", "Maria Receiver")}
          ${field("Amount", "amount", "500.00")}
          ${select("Currency", "currency", ["EUR", "USD", "GBP", "CHF", "USDC"])}
          ${sendFields(method)}
          ${select("Purpose", "purpose", ["Invoice", "Own account", "Family support", "Other"])}
          ${field("Reference", "reference", "PO-10029")}
        </div>
        <div class="form-actions">
          <button class="primary" type="submit">Create send request</button>
          <span class="hint">Maker-checker placeholder before real payout</span>
        </div>
      </form>
    `,
    aside: summary("Send", [
      ["Selected rail", labelFor(sendMethods, method)],
      ["Review", method === "crypto" ? "Manual review required" : "Ready for approval"],
      ["Status", "Demo payout prepared"]
    ])
  });
}

function renderCards() {
  return pageLayout({
    heading: "Cards",
    text: "Order a virtual or physical card with the minimum fields a client expects.",
    methods: "",
    form: `
      <form data-flow="card">
        <div class="form-grid">
          ${select("Card type", "cardType", ["Virtual card", "Physical card"])}
          ${field("Cardholder", "holderName", "Pilot Client")}
          ${select("Currency", "currency", ["EUR", "USD", "GBP", "CHF"])}
          ${field("Monthly limit", "monthlyLimit", "2500.00")}
          ${field("3DS phone", "scaPhone", "+31 6 1234 5678")}
          ${field("Delivery country", "deliveryCountry", "Netherlands")}
          ${textarea("Delivery address", "deliveryAddress", "Demo Street 10, 1011 AA Amsterdam")}
        </div>
        <div class="form-actions">
          <button class="primary" type="submit">Create card request</button>
          <span class="hint">Card issuing is not active in this static demo</span>
        </div>
      </form>
    `,
    aside: `
      <div class="card-preview">
        <strong>Bellfort Banking</strong>
        <div class="card-digits">4242 88XX XXXX 9010</div>
        <span>Demo card</span>
      </div>
      ${resultCard()}
    `
  });
}

function renderConvert() {
  const from = state.methods.convertFrom;
  const to = state.methods.convertTo;
  const quote = convertQuote(1000, from, to);
  return pageLayout({
    heading: "Convert",
    text: "Select a From box, click a fiat or crypto currency, then choose the To currency. All values are mock indicative rates.",
    methods: `
      <div class="convert-frame-grid">
        ${convertFrame("from", "From", from)}
        ${convertFrame("to", "To", to)}
      </div>
    `,
    form: `
      <form data-flow="convert">
        <div class="form-grid">
          ${field("Amount", "amount", "1000.00")}
          ${field("Indicative result", "result", quote.output)}
          ${field("From", "fromCurrency", from)}
          ${field("To", "toCurrency", to)}
          ${select("Purpose", "purpose", ["Treasury", "Travel", "Invoice", "Own account", "Other"])}
          ${field("Reference", "reference", "FX-2026-001")}
        </div>
        <div class="form-actions">
          <button class="primary" type="submit">Create convert request</button>
          <span class="hint">Rates are mock values for presentation only</span>
        </div>
      </form>

      <div class="currency-section">
        <div class="section-heading">
          <h3>Fiat currencies</h3>
          <span class="hint">Country flags fill the active box</span>
        </div>
        <div class="currency-grid">
          ${fiatCurrencies.map((currency) => currencyCard(currency)).join("")}
        </div>
      </div>

      <div class="currency-section">
        <div class="section-heading">
          <h3>Crypto assets</h3>
          <span class="hint">BTC, ETH, USDT, SOL, USDC</span>
        </div>
        <div class="asset-grid">
          ${cryptoAssets.map(([code, name, network]) => cryptoConvertCard(code, name, network)).join("")}
        </div>
      </div>
    `,
    aside: summary("Convert", [
      ["From", currencyLabel(from)],
      ["To", currencyLabel(to)],
      ["Indicative rate", quote.rate],
      ["Status", "Demo quote ready"]
    ])
  });
}

function renderCrypto() {
  return pageLayout({
    heading: "Crypto",
    text: "Prepare receive, send, or convert requests for supported demo assets.",
    methods: methodButtons("crypto", [["receive", "Receive", "Wallet instruction"], ["send", "Send", "Wallet payout"], ["convert", "Convert", "Asset exchange"]], state.methods.crypto),
    form: `
      <form data-flow="crypto">
        <div class="asset-grid">
          ${cryptoAssets.map(([code, name, network]) => `
            <button type="button" class="asset ${state.methods.asset === code ? "active" : ""}" data-asset="${code}">
              <strong>${code}</strong>
              <span>${name} / ${network}</span>
            </button>
          `).join("")}
        </div>
        <div class="form-grid" style="margin-top:16px">
          ${field("Asset", "asset", state.methods.asset)}
          ${select("Network", "network", ["Bitcoin", "Ethereum", "ERC20", "TRC20"])}
          ${field("Amount", "amount", state.methods.asset === "BTC" ? "0.025" : "1000.00")}
          ${field("Wallet address", "walletAddress", "Demo wallet address")}
          ${field("Counterparty country", "counterpartyCountry", "NL")}
          ${select("Purpose", "purpose", ["Own account", "Invoice", "Treasury", "Other"])}
        </div>
        <div class="form-actions">
          <button class="primary" type="submit">Create crypto request</button>
          <span class="hint">Screening placeholder before real transaction</span>
        </div>
      </form>
    `,
    aside: summary("Crypto", [
      ["Selected asset", state.methods.asset],
      ["Screening", "Sanctions and wallet risk placeholder"],
      ["Status", "Demo request only"]
    ])
  });
}

function renderCasino() {
  return pageLayout({
    heading: "Casino Window",
    text: "A separate merchant-facing window. It is not the core platform and can only use confirmed internal payment references.",
    methods: `<div class="casino-banner"><h3>Merchant module</h3><p>Use this only as a demo of how a merchant category can consume a confirmed Bellfort payment.</p></div>`,
    form: `
      <form data-flow="casino">
        <div class="form-grid">
          ${field("Casino user ID", "casinoUserId", "player-001")}
          ${field("Confirmed internal payment ID", "paymentId", "pay_confirmed_demo_001")}
          ${field("Amount", "amount", "100.00")}
          ${select("Currency", "currency", ["EUR", "USD", "GBP"])}
          ${field("Player reference", "reference", "TOPUP-1001")}
        </div>
        <div class="form-actions">
          <button class="primary" type="submit">Create casino top-up</button>
          <span class="hint">Only confirmed payment references are accepted in real use</span>
        </div>
      </form>
    `,
    aside: summary("Casino Window", [
      ["Architecture", "Optional merchant window"],
      ["Payment rule", "Confirmed internal payment only"],
      ["Status", "Demo top-up prepared"]
    ])
  });
}

function pageLayout({ heading, text, methods, form, aside }) {
  return `
    <section class="page-layout">
      <div class="panel">
        <div class="panel-heading">
          <div>
            <h2>${heading}</h2>
            <p class="muted">${text}</p>
          </div>
          <span class="status">Static demo</span>
        </div>
        ${methods}
        ${form}
      </div>
      <aside class="summary-card">
        ${aside}
      </aside>
    </section>
  `;
}

function methodButtons(group, list, active) {
  return `
    <div class="method-grid">
      ${list.map(([id, title, text]) => `
        <button type="button" class="method ${active === id ? "active" : ""}" data-group="${group}" data-method="${id}">
          <strong>${title}</strong>
          <span>${text}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function convertFrame(side, label, code) {
  return `
    <button type="button" class="convert-frame ${state.methods.convertSide === side ? "active" : ""}" data-convert-side="${side}">
      <span>${label}</span>
      <strong>${code}</strong>
      <small>${currencyLabel(code)}</small>
    </button>
  `;
}

function currencyCard([code, flag, name, country]) {
  const selected = state.methods.convertFrom === code || state.methods.convertTo === code;
  return `
    <button type="button" class="currency-card ${selected ? "selected" : ""}" data-convert-value="${code}">
      <span class="flag">${flag}</span>
      <strong>${code}</strong>
      <small>${name} / ${country}</small>
    </button>
  `;
}

function cryptoConvertCard(code, name, network) {
  const selected = state.methods.convertFrom === code || state.methods.convertTo === code;
  return `
    <button type="button" class="asset ${selected ? "active" : ""}" data-convert-value="${code}">
      <strong>${code}</strong>
      <span>${name} / ${network}</span>
    </button>
  `;
}

function currencyLabel(code) {
  const fiat = fiatCurrencies.find((item) => item[0] === code);
  if (fiat) return `${fiat[1]} ${fiat[2]}`;
  const crypto = cryptoAssets.find((item) => item[0] === code);
  if (crypto) return `${crypto[1]}`;
  return code;
}

function convertQuote(amount, from, to) {
  const fromUsd = fiatCurrencies.find((item) => item[0] === from)?.[4] || cryptoRates[from] || 1;
  const toUsd = fiatCurrencies.find((item) => item[0] === to)?.[4] || cryptoRates[to] || 1;
  const value = amount * fromUsd / toUsd;
  const output = `${formatAmount(value)} ${to}`;
  const rate = `1 ${from} = ${formatAmount(fromUsd / toUsd)} ${to}`;
  return { output, rate };
}

function formatAmount(value) {
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (value >= 1) return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return value.toLocaleString("en-US", { maximumFractionDigits: 8 });
}

function receiveFields(method) {
  if (method === "card") return `${select("Card type", "fundingSource", ["Debit card", "Credit card"])}`;
  if (method === "sepa") return `${field("Payer IBAN", "payerIban", "NL91 ABNA 0417 1643 00")}`;
  if (method === "iban") return `${field("Payment reference", "paymentReference", "RF18BELLFORT2026")}`;
  if (method === "bank") return `${field("Sender bank country", "bankCountry", "Netherlands")}`;
  return `${select("Asset", "asset", ["BTC", "ETH", "USDT", "USDC"])}${field("Sender wallet", "senderWallet", "Demo sender wallet")}`;
}

function sendFields(method) {
  if (method === "crypto") return `${select("Asset", "asset", ["BTC", "ETH", "USDT", "USDC"])}${field("Wallet address", "walletAddress", "Demo wallet address")}`;
  if (method === "bank") return `${field("Account number", "accountNumber", "123456789")}${field("Bank country", "bankCountry", "Germany")}`;
  return `${field("Recipient IBAN", "iban", "DE89 3704 0044 0532 0130 00")}${field("BIC / SWIFT", "bic", "COBADEFFXXX")}`;
}

function summary(title, rows) {
  return `
    <div class="summary-box">
      <strong>${title}</strong>
      <span class="muted">Clean partner presentation view.</span>
      <div style="margin-top:12px">
        ${rows.map(([key, value]) => `<div class="timeline-row"><span>${key}</span><strong>${value}</strong></div>`).join("")}
      </div>
    </div>
    ${resultCard()}
  `;
}

function resultCard() {
  if (!state.result) return "";
  return `
    <div class="summary-box success">
      <strong>Mock created</strong>
      <span class="muted">${state.result.type} reference</span>
      <div class="timeline-row"><span>ID</span><strong>${state.result.reference}</strong></div>
      <div class="timeline-row"><span>Status</span><strong>Prepared</strong></div>
    </div>
  `;
}

function featureCard(icon, title, text, route) {
  return `
    <button type="button" class="feature-card" data-route="${route}">
      <span>${icon}</span>
      <strong>${title}</strong>
      <small>${text}</small>
    </button>
  `;
}

function balanceRow(currency, amount) {
  return `<div class="balance-row"><span>${currency}</span><strong>${amount}</strong></div>`;
}

function field(label, name, value = "", type = "text") {
  return `
    <div class="field">
      <label for="${name}">${label}</label>
      <input id="${name}" name="${name}" type="${type}" value="${value}">
    </div>
  `;
}

function select(label, name, options) {
  return `
    <div class="field">
      <label for="${name}">${label}</label>
      <select id="${name}" name="${name}">
        ${options.map((option) => `<option>${option}</option>`).join("")}
      </select>
    </div>
  `;
}

function textarea(label, name, value) {
  return `
    <div class="field full">
      <label for="${name}">${label}</label>
      <textarea id="${name}" name="${name}">${value}</textarea>
    </div>
  `;
}

function labelFor(list, id) {
  return list.find((item) => item[0] === id)?.[1] || id;
}
