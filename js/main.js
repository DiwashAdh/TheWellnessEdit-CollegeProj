/* =========================================================
   The Wellness Edit — front-end only (no database, no server)
   Cart, currency and language are kept in the browser.
   ========================================================= */

/* ---------- Product catalog ---------- */
const PRODUCTS = {
  chill: {
    id: "chill",
    name: "The Chill Pill",
    ingredient: "Ashwagandha",
    price: 22,
    count: "60 supplements per container",
    number: "01 / To unwind",
    img: "assets/img/chill-pill.jpg",
    gallery: ["assets/img/chill-pill.jpg", "assets/img/everyday-pair.jpg", "assets/img/ingredient-tea.jpg"],
    tags: ["Calm", "Balance", "Reset"],
    short: "A simple ashwagandha formula for your wind-down routine. A small moment of care as the day slows down.",
    long: "The Chill Pill is our evening essential: a single, clearly named botanical in an easy-to-take capsule. Ashwagandha has been used in traditional practices for centuries. We keep the formula simple so you always know what you are taking.",
    how: "Take as directed on the label, ideally with an evening meal or as part of your wind-down routine.",
    facts: [["Serving size", "2 capsules"], ["Servings per container", "30"], ["Ashwagandha root extract", "See label"], ["Capsule", "Plant-based (HPMC)"]]
  },
  green: {
    id: "green",
    name: "Daily Green",
    ingredient: "Moringa",
    price: 19,
    count: "180 supplements per container",
    number: "02 / For every day",
    img: "assets/img/daily-green.jpg",
    gallery: ["assets/img/daily-green.jpg", "assets/img/everyday-pair.jpg", "assets/img/bowl.jpg"],
    tags: ["Energy", "Immunity", "Nourish"],
    short: "A simple moringa formula for an easy daily habit. Green, uncomplicated and made to fit into your day.",
    long: "Daily Green brings moringa — a leafy green botanical — into a simple daily capsule. With 180 supplements per container, it is made to become part of your morning without a second thought.",
    how: "Take as directed on the label, ideally with breakfast so a familiar daily moment becomes your reminder.",
    facts: [["Serving size", "3 capsules"], ["Servings per container", "60"], ["Moringa leaf powder", "See label"], ["Capsule", "Plant-based (HPMC)"]]
  },
  pair: {
    id: "pair",
    name: "The Everyday Pair",
    ingredient: "The Chill Pill + Daily Green",
    price: 35,
    count: "1 × The Chill Pill (60) + 1 × Daily Green (180)",
    img: "assets/img/everyday-pair.jpg"
  }
};

/* ---------- Reference exchange rates (illustrative, for display text only) ---------- */
const CURRENCIES = {
  USD: { rate: 1, locale: "en-US", label: "USD $" },
  CAD: { rate: 1.37, locale: "en-CA", label: "CAD $" },
  EUR: { rate: 0.92, locale: "de-DE", label: "EUR €" },
  GBP: { rate: 0.79, locale: "en-GB", label: "GBP £" },
  MXN: { rate: 18.5, locale: "es-MX", label: "MXN $" },
  INR: { rate: 83.5, locale: "en-IN", label: "INR ₹" },
  NPR: { rate: 133.5, locale: "en-IN", label: "NPR रु" },
  JPY: { rate: 150, locale: "ja-JP", label: "JPY ¥" }
};

/* ---------- Safe storage ---------- */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
  }
};

const state = {
  cart: store.get("twe_cart", {}),
  currency: store.get("twe_currency", "USD"),
  lang: store.get("twe_lang", "en")
};
if (!CURRENCIES[state.currency]) state.currency = "USD";

function formatMoney(usd) {
  const code = state.currency;
  const v = usd * CURRENCIES[code].rate;
  const digits = code === "JPY" || v >= 100 || v % 1 === 0 ? 0 : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: code, minimumFractionDigits: digits, maximumFractionDigits: digits
  }).format(digits ? v : Math.round(v));
}

/* ---------- Language ----------
   Keyed by the English text on the page; ES / FR replace it in place. */
const LANGS = { en: "English", es: "Español", fr: "Français" };
const I18N = {
  "A little care, delivered. Free US shipping over $60.": ["Un poco de cuidado, a domicilio. Envío gratis en EE. UU. desde $60.", "Un peu de soin, livré chez vous. Livraison offerte aux États-Unis dès 60 $."],
  "Shop the collection": ["Ver la colección", "La collection"],
  "Our approach": ["Nuestro enfoque", "Notre approche"],
  "The journal": ["El diario", "Le journal"],
  "FAQ": ["Preguntas", "FAQ"],
  "Contact": ["Contacto", "Contact"],
  "Bag": ["Bolsa", "Panier"],
  "Rooted in nature. Guided by science.": ["Arraigado en la naturaleza. Guiado por la ciencia.", "Ancré dans la nature. Guidé par la science."],
  "A little ritual.<br>A fuller life.": ["Un pequeño ritual.<br>Una vida más plena.", "Un petit rituel.<br>Une vie plus pleine."],
  "Thoughtful supplements for the everyday. Two simple formulas. One gentler way to care for yourself.": ["Suplementos pensados para el día a día. Dos fórmulas simples. Una forma más amable de cuidarte.", "Des compléments pensés pour le quotidien. Deux formules simples. Une façon plus douce de prendre soin de soi."],
  "Find your daily ritual": ["Encuentra tu ritual diario", "Trouvez votre rituel"],
  "Ashwagandha to unwind. Moringa for every day.": ["Ashwagandha para relajarte. Moringa para cada día.", "L'ashwagandha pour se détendre. Le moringa pour chaque jour."],
  "The everyday collection": ["La colección diaria", "La collection du quotidien"],
  "From first light to slow evenings.": ["Del amanecer a las tardes tranquilas.", "Du premier rayon aux soirées paisibles."],
  "Wellness, without the noise": ["Bienestar, sin ruido", "Le bien-être, sans le bruit"],
  "Not more things to take. Just a few good things to come back to, every day.": ["No más cosas que tomar. Solo unas pocas cosas buenas a las que volver, cada día.", "Pas plus de choses à prendre. Juste quelques bonnes choses auxquelles revenir, chaque jour."],
  "A small, intentional collection": ["Una colección pequeña e intencional", "Une petite collection réfléchie"],
  "Two essentials. Yours, daily.": ["Dos esenciales. Tuyos, cada día.", "Deux essentiels. Les vôtres, chaque jour."],
  "A place to begin, not a shelf to fill. Discover the formula that fits your rhythm.": ["Un lugar para empezar, no un estante que llenar. Descubre la fórmula que va con tu ritmo.", "Un point de départ, pas une étagère à remplir. Découvrez la formule qui suit votre rythme."],
  "View details": ["Ver detalles", "Voir les détails"],
  "Add The Chill Pill to bag": ["Añadir The Chill Pill", "Ajouter The Chill Pill"],
  "Add Daily Green to bag": ["Añadir Daily Green", "Ajouter Daily Green"],
  "Add to bag": ["Añadir a la bolsa", "Ajouter au panier"],
  "The ingredient edit": ["Los ingredientes", "Les ingrédients"],
  "Know what goes in.": ["Conoce lo que contiene.", "Sachez ce qu'il contient."],
  "Make room for yourself": ["Haz espacio para ti", "Faites-vous de la place"],
  "Small rituals. Real life.": ["Pequeños rituales. Vida real.", "Petits rituels. Vraie vie."],
  "Begin with Daily Green.": ["Empieza con Daily Green.", "Commencez avec Daily Green."],
  "Slow down with The Chill Pill.": ["Desacelera con The Chill Pill.", "Ralentissez avec The Chill Pill."],
  "Keep it your kind of simple.": ["Mantenlo simple, a tu manera.", "Restez simple, à votre façon."],
  "A more considered kind of care": ["Un cuidado más consciente", "Un soin plus réfléchi"],
  "Nature sets the pace.<br>Clarity leads the way.": ["La naturaleza marca el ritmo.<br>La claridad guía el camino.", "La nature donne le rythme.<br>La clarté montre la voie."],
  "Meet The Wellness Edit →": ["Conoce The Wellness Edit →", "Découvrir The Wellness Edit →"],
  "Better in rhythm": ["Mejor en ritmo", "Mieux en rythme"],
  "Your day, thoughtfully paired.": ["Tu día, bien acompañado.", "Votre journée, joliment accompagnée."],
  "Shop the everyday pair": ["Compra el dúo diario", "Acheter le duo"],
  "Kind words": ["Palabras amables", "Mots doux"],
  "Words from our community.": ["Palabras de nuestra comunidad.", "Les mots de notre communauté."],
  "One table, many traditions": ["Una mesa, muchas tradiciones", "Une table, mille traditions"],
  "Wellness for every culture and every table.": ["Bienestar para cada cultura y cada mesa.", "Le bien-être pour chaque culture et chaque table."],
  "Five minutes, just for you.": ["Cinco minutos, solo para ti.", "Cinq minutes, rien que pour vous."],
  "Notes on living well": ["Notas para vivir bien", "Notes pour bien vivre"],
  "A little food for thought.": ["Algo en qué pensar.", "Matière à réflexion."],
  "Explore the journal →": ["Explora el diario →", "Explorer le journal →"],
  "Read the story ↗": ["Leer la historia ↗", "Lire l'article ↗"],
  "Good questions": ["Buenas preguntas", "Bonnes questions"],
  "A little more clarity.": ["Un poco más de claridad.", "Un peu plus de clarté."],
  "Ask us a question →": ["Haznos una pregunta →", "Posez-nous une question →"],
  "Advertise with us": ["Anúnciate con nosotros", "Annoncez chez nous"],
  "A note, now and then": ["Una nota, de vez en cuando", "Un mot, de temps en temps"],
  "A calmer kind of inbox.": ["Una bandeja de entrada más tranquila.", "Une boîte de réception plus sereine."],
  "Thoughtful reads, everyday rituals and news from The Wellness Edit. Just the good things.": ["Lecturas, rituales y novedades de The Wellness Edit. Solo lo bueno.", "Lectures, rituels et nouvelles de The Wellness Edit. Seulement le meilleur."],
  "Care, in your own rhythm.": ["Cuidado, a tu propio ritmo.", "Prendre soin, à votre rythme."],
  "Discover": ["Descubrir", "Découvrir"],
  "About The Wellness Edit": ["Sobre The Wellness Edit", "À propos"],
  "Here to help": ["Para ayudarte", "À votre écoute"],
  "The team": ["El equipo", "L'équipe"],
  "Ingredient notes": ["Ingredientes", "Ingrédients"],
  "Contact us": ["Contáctanos", "Nous contacter"],
  "Shipping &amp; returns": ["Envíos y devoluciones", "Livraison et retours"],
  "Frequently asked questions": ["Preguntas frecuentes", "Questions fréquentes"],
  "Security": ["Seguridad", "Sécurité"],
  "Privacy": ["Privacidad", "Confidentialité"],
  "Terms": ["Términos", "Conditions"],
  "Policies": ["Políticas", "Politiques"],
  "About us": ["Sobre nosotros", "À propos"],
  "The people behind The Wellness Edit.": ["Las personas detrás de The Wellness Edit.", "Les personnes derrière The Wellness Edit."],
  "We're here to help.": ["Estamos aquí para ayudarte.", "Nous sommes là pour vous."],
  "Send message": ["Enviar mensaje", "Envoyer"],
  "Your bag.": ["Tu bolsa.", "Votre panier."],
  "Summary": ["Resumen", "Récapitulatif"],
  "Subtotal": ["Subtotal", "Sous-total"],
  "Shipping": ["Envío", "Livraison"],
  "Total": ["Total", "Total"],
  "Checkout": ["Finalizar compra", "Commander"],
  "You may also like.": ["También te puede gustar.", "Vous aimerez aussi."],
  "What customers say.": ["Lo que dicen los clientes.", "Ce que disent nos clients."]
};

const TEXT_SELECTOR = ".announce,h1,h2,h3,h4,p,a,span,li,summary,button,label,th,td";
function applyLanguage() {
  const idx = state.lang === "es" ? 0 : state.lang === "fr" ? 1 : -1;
  document.documentElement.lang = state.lang;
  document.querySelectorAll(TEXT_SELECTOR).forEach(el => {
    if (el.dataset.en === undefined) {
      // Only leaf-ish elements: plain text, optionally with <br>
      if (el.querySelector(":not(br)")) return;
      const key = el.innerHTML.trim();
      if (!I18N[key]) return;
      el.dataset.en = key;
    }
    el.innerHTML = idx < 0 ? el.dataset.en : I18N[el.dataset.en][idx];
  });
  const ph = document.getElementById("news-email");
  if (ph) ph.placeholder = ["Tu correo electrónico", "Votre adresse e-mail"][idx] || "Your email address";
  updateLocaleButton();
}

function updateLocaleButton() {
  const b = document.querySelector(".locale-btn .locale-label");
  if (b) b.textContent = `${state.lang.toUpperCase()} · ${state.currency}`;
  document.querySelectorAll("[data-set-lang]").forEach(x => x.setAttribute("aria-pressed", x.dataset.setLang === state.lang));
  document.querySelectorAll("[data-set-cur]").forEach(x => x.setAttribute("aria-pressed", x.dataset.setCur === state.currency));
  document.querySelectorAll(".js-region").forEach(x => { x.textContent = `${LANGS[state.lang]} · ${CURRENCIES[state.currency].label}`; });
}

/* ---------- Icons ---------- */
const ICON = {
  arrow: '<svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 3.8c2.7 0 3 0 4 .1 2.7.1 4 1.4 4.1 4.1.1 1 .1 1.4.1 4s0 3-.1 4c-.1 2.7-1.4 4-4.1 4.1-1 .1-1.4.1-4 .1s-3 0-4-.1c-2.7-.1-4-1.4-4.1-4.1-.1-1-.1-1.4-.1-4s0-3 .1-4C4 5.3 5.3 4 8 3.9c1-.1 1.3-.1 4-.1ZM12 2c-2.7 0-3.1 0-4.1.1C4.2 2.3 2.3 4.2 2.1 7.9 2 8.9 2 9.3 2 12s0 3.1.1 4.1c.2 3.7 2.1 5.6 5.8 5.8 1 .1 1.4.1 4.1.1s3.1 0 4.1-.1c3.7-.2 5.6-2.1 5.8-5.8.1-1 .1-1.4.1-4.1s0-3.1-.1-4.1c-.2-3.7-2.1-5.6-5.8-5.8C15.1 2 14.7 2 12 2Z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.6V14h2.8v8h3.1Z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.2v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.6a5.8 5.8 0 1 0 5 5.8V9a7.4 7.4 0 0 0 4.3 1.4V7.2a4.3 4.3 0 0 1-3.2-1.4Z"/></svg>',
  pinterest: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.5 2.1-4.5 4.4 0 .9.3 1.8.7 2.3.1.1.1.2.1.3l-.3 1.1c0 .2-.2.2-.4.1-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A10 10 0 1 0 12 2Z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z"/></svg>'
};

/* ---------- Shared header & footer ---------- */
function logoHTML() {
  return '<span class="logo-mark">we<span class="dot">.</span></span><span class="logo-word">The<br>Wellness<br>Edit</span>';
}

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const page = document.body.dataset.page || "";
  const link = (href, text, name) =>
    `<li><a href="${href}"${page === name ? ' aria-current="page"' : ""}>${text}</a></li>`;

  el.outerHTML = `
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="announce">A little care, delivered. Free US shipping over $60.</div>
  <header class="site-header" id="header">
    <div class="wrap header-inner">
      <a class="logo" href="index.html" aria-label="The Wellness Edit — home">${logoHTML()}</a>
      <nav class="main-nav" id="main-nav" aria-label="Main">
        <button class="nav-close" id="nav-close" aria-label="Close menu">&times;</button>
        <ul>
          ${link("shop.html", "Shop the collection", "shop")}
          ${link("about.html", "Our approach", "about")}
          ${link("journal.html", "The journal", "journal")}
          ${link("faq.html", "FAQ", "faq")}
          ${link("contact.html", "Contact", "contact")}
        </ul>
      </nav>
      <div class="header-tools">
        <div class="locale">
          <button class="locale-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="locale-panel">${ICON.globe}<span class="locale-label">EN · USD</span></button>
          <div class="locale-panel" id="locale-panel" role="dialog" aria-label="Language and currency">
            <p class="locale-title">Language</p>
            <div class="locale-langs">${Object.entries(LANGS).map(([k, v]) => `<button type="button" data-set-lang="${k}">${v}</button>`).join("")}</div>
            <p class="locale-title">Currency</p>
            <div class="locale-curs">${Object.entries(CURRENCIES).map(([k, c]) => `<button type="button" data-set-cur="${k}"><strong>${k}</strong><span>${c.label.split(" ")[1]}</span></button>`).join("")}</div>
            <p class="locale-note">Prices are converted at approximate rates. Orders are charged in USD.</p>
          </div>
        </div>
        <a class="bag-link" href="cart.html" aria-label="Shopping bag">${ICON.bag}<span class="bag-text"><span>Bag</span> (<span class="bag-count">0</span>)</span></a>
        <button class="menu-toggle" id="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">${ICON.menu}</button>
      </div>
    </div>
  </header>
  <div class="nav-backdrop" id="nav-backdrop"></div>`;
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const year = new Date().getFullYear();
  el.outerHTML = `
  <footer class="site-footer">
    <div class="wrap">
      <div class="newsletter">
        <div>
          <span class="eyebrow">A note, now and then</span>
          <h2>A calmer kind of inbox.</h2>
          <p>Thoughtful reads, everyday rituals and news from The Wellness Edit. Just the good things.</p>
        </div>
        <div>
          <form class="news-form js-newsletter" novalidate>
            <label class="sr-only" for="news-email">Email address</label>
            <input id="news-email" type="email" required placeholder="Your email address">
            <button type="submit" aria-label="Subscribe">${ICON.arrow}</button>
          </form>
          <p class="news-note js-news-msg">By signing up, you agree to our <a href="privacy.html">Privacy Policy</a>. Unsubscribe any time.</p>
        </div>
      </div>

      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo" href="index.html" aria-label="The Wellness Edit — home">${logoHTML()}</a>
          <p class="tagline">Care, in your own rhythm.</p>
          <div class="socials" aria-label="Social media">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">${ICON.instagram}</a>
            <a href="https://www.tiktok.com/" target="_blank" rel="noopener" aria-label="TikTok">${ICON.tiktok}</a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook">${ICON.facebook}</a>
            <a href="https://www.pinterest.com/" target="_blank" rel="noopener" aria-label="Pinterest">${ICON.pinterest}</a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube">${ICON.youtube}</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Discover</h4>
          <ul>
            <li><a href="chill-pill.html">The Chill Pill</a></li>
            <li><a href="daily-green.html">Daily Green</a></li>
            <li><a href="shop.html#pair">The everyday pair</a></li>
            <li><a href="shop.html">Shop the collection</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>About The Wellness Edit</h4>
          <ul>
            <li><a href="about.html">Our approach</a></li>
            <li><a href="about.html#team">The team</a></li>
            <li><a href="ingredients.html">Ingredient notes</a></li>
            <li><a href="journal.html">The journal</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Here to help</h4>
          <ul>
            <li><a href="contact.html">Contact us</a></li>
            <li><a href="policies.html#shipping">Shipping &amp; returns</a></li>
            <li><a href="faq.html">Frequently asked questions</a></li>
            <li><a href="security.html">Security</a></li>
          </ul>
        </div>
      </div>

      <p class="footer-legal">Dietary supplements are not a substitute for a varied, balanced diet and a healthy lifestyle. These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure or prevent any disease.</p>
      <div class="footer-bottom">
        <span>&copy; ${year} The Wellness Edit. A considered way to care.</span>
        <nav aria-label="Legal">
          <a href="privacy.html">Privacy</a>
          <a href="policies.html#terms">Terms</a>
          <a href="policies.html">Policies</a>
          <a href="security.html">Security</a>
          <span class="js-region">English · USD $</span>
        </nav>
      </div>
      <p class="webmaster">Webmaster: Diwash Adhikari, VP of Technology · <a href="mailto:webmaster@thewellnessedit.com">webmaster@thewellnessedit.com</a> · Last updated November 2026</p>
      <p class="webmaster">The Wellness Edit is a conceptual brand created for a school e-business project. Product details and prices are illustrative.</p>
    </div>
  </footer>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

/* ---------- Price text ---------- */
function applyPrices() {
  document.querySelectorAll("[data-usd]").forEach(el => { el.textContent = formatMoney(parseFloat(el.dataset.usd)); });
  updateLocaleButton();
  renderCart();
}

/* ---------- Cart ---------- */
function cartCount() {
  return Object.values(state.cart).reduce((a, b) => a + b, 0);
}
function cartSubtotal() {
  return Object.entries(state.cart).reduce((sum, [id, qty]) => sum + (PRODUCTS[id] ? PRODUCTS[id].price * qty : 0), 0);
}
function saveCart() {
  store.set("twe_cart", state.cart);
  document.querySelectorAll(".bag-count").forEach(el => { el.textContent = cartCount(); });
}
function addToCart(id, qty = 1) {
  if (!PRODUCTS[id]) return;
  state.cart[id] = (state.cart[id] || 0) + qty;
  saveCart();
  toast(`${PRODUCTS[id].name} added to your bag. <a href="cart.html">View bag</a>`);
}
function setQty(id, qty) {
  if (qty <= 0) delete state.cart[id]; else state.cart[id] = Math.min(qty, 20);
  saveCart();
  renderCart();
}

let toastTimer;
function toast(html) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.innerHTML = html;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

/* Cart page rendering (only runs where #cart-root exists) */
const FREE_SHIP = 60;
const SHIP_COST = 6;
function renderCart() {
  const root = document.getElementById("cart-root");
  if (!root) return;
  const ids = Object.keys(state.cart).filter(id => PRODUCTS[id]);
  const checkoutBtn = document.getElementById("to-checkout");

  if (!ids.length) {
    root.innerHTML = `<div class="empty-cart">
      <h2>Your bag is empty.</h2>
      <p class="muted">A place to begin, not a shelf to fill.</p>
      <a class="btn" href="shop.html">Shop the collection ${ICON.arrow}</a></div>`;
    document.getElementById("cart-summary").style.display = "none";
    document.getElementById("checkout").classList.remove("show");
    return;
  }
  document.getElementById("cart-summary").style.display = "";

  root.innerHTML = `<div class="cart-items">` + ids.map(id => {
    const p = PRODUCTS[id], q = state.cart[id];
    return `<div class="cart-item">
      <img src="${p.img}" alt="${p.name}">
      <div>
        <h3>${p.name}</h3>
        <p class="tiny" style="margin:0 0 10px">${p.ingredient} · ${p.count}</p>
        <div class="qty" aria-label="Quantity for ${p.name}">
          <button type="button" data-dec="${id}" aria-label="Decrease">−</button>
          <input type="number" min="1" max="20" value="${q}" data-qty="${id}" aria-label="Quantity">
          <button type="button" data-inc="${id}" aria-label="Increase">+</button>
        </div><br>
        <button type="button" class="remove" data-remove="${id}">Remove</button>
      </div>
      <div class="line-total">${formatMoney(p.price * q)}</div>
    </div>`;
  }).join("") + `</div>`;

  const sub = cartSubtotal();
  const freeShip = sub >= FREE_SHIP || state.cart.pair > 0;
  const ship = freeShip ? 0 : SHIP_COST;
  const tax = Math.round(sub * 0.0825 * 100) / 100;
  document.getElementById("sum-sub").textContent = formatMoney(sub);
  document.getElementById("sum-ship").textContent = ship ? formatMoney(ship) : "Free";
  document.getElementById("sum-tax").textContent = formatMoney(tax);
  document.getElementById("sum-total").textContent = formatMoney(sub + ship + tax);
  const left = FREE_SHIP - sub;
  document.getElementById("ship-msg").innerHTML = !freeShip
    ? `You are ${formatMoney(left)} away from free US shipping.`
    : "You have unlocked free US shipping.";
  document.getElementById("ship-bar").style.width = (freeShip ? 100 : sub / FREE_SHIP * 100) + "%";
  if (checkoutBtn) checkoutBtn.disabled = false;
}

function bindCart() {
  const root = document.getElementById("cart-root");
  if (!root) return;
  root.addEventListener("click", e => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.inc) setQty(t.dataset.inc, state.cart[t.dataset.inc] + 1);
    if (t.dataset.dec) setQty(t.dataset.dec, state.cart[t.dataset.dec] - 1);
    if (t.dataset.remove) setQty(t.dataset.remove, 0);
  });
  root.addEventListener("change", e => {
    if (e.target.dataset.qty) setQty(e.target.dataset.qty, parseInt(e.target.value, 10) || 0);
  });
  const go = document.getElementById("to-checkout");
  go && go.addEventListener("click", () => {
    const c = document.getElementById("checkout");
    c.classList.add("show");
    c.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  const form = document.getElementById("checkout-form");
  form && form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const orderNo = "WE-" + Math.floor(100000 + Math.random() * 900000);
    const total = document.getElementById("sum-total").textContent;
    state.cart = {};
    saveCart();
    document.getElementById("cart-page").innerHTML = `
      <div class="empty-cart center" style="max-width:640px;margin:0 auto">
        <span class="eyebrow">Order received</span>
        <h1 style="font-size:clamp(40px,6vw,64px)">Thank you. Your ritual is on its way.</h1>
        <p class="lead" style="margin:0 auto 28px">Order <strong>${orderNo}</strong> · ${total}. This is a demo storefront, so no payment was taken and nothing will ship.</p>
        <a class="btn" href="index.html">Back to home ${ICON.arrow}</a>
      </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Product page ---------- */
function renderProductPage() {
  const root = document.getElementById("pdp-root");
  if (!root) return;
  const id = document.body.dataset.product;
  const p = PRODUCTS[id] && id !== "pair" ? PRODUCTS[id] : PRODUCTS.chill;
  const other = p.id === "chill" ? PRODUCTS.green : PRODUCTS.chill;
  document.title = `${p.name} (${p.ingredient}) — The Wellness Edit`;
  const crumb = document.getElementById("crumb-name");
  if (crumb) crumb.textContent = p.name;

  root.innerHTML = `
  <div class="pdp-gallery">
    <img id="pdp-main" src="${p.gallery[0]}" alt="${p.name} — ${p.ingredient} supplement bottle">
    <div class="pdp-thumbs">
      ${p.gallery.map((src, i) => `<button type="button" data-src="${src}" aria-pressed="${i === 0}" aria-label="Show image ${i + 1}"><img src="${src}" alt=""></button>`).join("")}
    </div>
  </div>
  <div class="pdp-info">
    <span class="eyebrow">${p.number}</span>
    <h1>${p.name}</h1>
    <p class="ingredient" style="font-weight:500;margin:0 0 4px">${p.ingredient}</p>
    <p class="tiny">${p.count}</p>
    <p class="pdp-price" data-usd="${p.price}">${formatMoney(p.price)}</p>
    <ul class="tags">${p.tags.map(t => `<li>${t}</li>`).join("")}</ul>
    <p class="muted">${p.long}</p>
    <div class="buy-row">
      <div class="qty">
        <button type="button" id="q-dec" aria-label="Decrease">−</button>
        <input type="number" id="q-val" min="1" max="20" value="1" aria-label="Quantity">
        <button type="button" id="q-inc" aria-label="Increase">+</button>
      </div>
      <button class="btn" id="pdp-add" type="button"><span>Add to bag</span> ${ICON.arrow}</button>
    </div>
    <div class="trust">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg>Free US shipping over $60</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg>30-day returns</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg>No subscription</span>
    </div>
    <div class="facts">
      <details open><summary>How to take it</summary><div class="answer">${p.how} For adults only. Check with a healthcare professional before use, especially if pregnant, breastfeeding, taking medication or managing a health condition.</div></details>
      <details><summary>Supplement facts</summary><div class="answer"><table>${p.facts.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</table><p class="tiny" style="margin-top:10px">Illustrative values for a school project. Always read the real label.</p></div></details>
      <details><summary>Shipping &amp; returns</summary><div class="answer">Orders ship in 1–2 business days. Free US shipping on orders over $60. Unopened products can be returned within 30 days. <a class="text-link" href="policies.html#shipping">Read our policies</a></div></details>
    </div>
  </div>`;

  const other_el = document.getElementById("pdp-other");
  if (other_el) other_el.innerHTML = productCardHTML(other);

  const qv = document.getElementById("q-val");
  document.getElementById("q-dec").onclick = () => { qv.value = Math.max(1, (+qv.value || 1) - 1); };
  document.getElementById("q-inc").onclick = () => { qv.value = Math.min(20, (+qv.value || 1) + 1); };
  document.getElementById("pdp-add").onclick = () => addToCart(p.id, Math.max(1, Math.min(20, +qv.value || 1)));
  root.querySelectorAll(".pdp-thumbs button").forEach(b => b.addEventListener("click", () => {
    document.getElementById("pdp-main").src = b.dataset.src;
    root.querySelectorAll(".pdp-thumbs button").forEach(x => x.setAttribute("aria-pressed", x === b));
  }));
}

function productCardHTML(p) {
  return `<article class="product-card">
    <a class="media" href="${p.id === "chill" ? "chill-pill" : "daily-green"}.html"><img src="${p.img}" alt="${p.name} — ${p.ingredient}" loading="lazy"></a>
    <span class="eyebrow">${p.number}</span>
    <div class="product-title-row"><h3><a href="${p.id === "chill" ? "chill-pill" : "daily-green"}.html">${p.name}</a></h3><span class="price" data-usd="${p.price}">${formatMoney(p.price)}</span></div>
    <p class="ingredient">${p.ingredient}</p>
    <p class="count">${p.count}</p>
    <p class="desc">${p.short}</p>
    <div class="card-actions">
      <button class="btn" type="button" data-add="${p.id}"><span>Add ${p.name} to bag</span> ${ICON.arrow}</button>
      <a class="text-link" href="${p.id === "chill" ? "chill-pill" : "daily-green"}.html">View details</a>
    </div>
  </article>`;
}

/* ---------- Forms ---------- */
function bindForms() {
  document.querySelectorAll(".js-newsletter").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const input = form.querySelector("input");
      const msg = form.parentElement.querySelector(".js-news-msg");
      if (!input.checkValidity() || !input.value) {
        msg.textContent = "Please enter a valid email address.";
        return;
      }
      msg.textContent = "Thank you — you're on the list. (Demo only: no email is stored.)";
      form.reset();
    });
  });

  document.querySelectorAll(".js-contact").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const ok = form.querySelector(".form-success");
      const name = form.querySelector("[name=name]").value.split(" ")[0];
      ok.innerHTML = `Thank you, ${name.replace(/[<>&]/g, "")}. Our customer service team usually replies within one business day. (Demo form: nothing was sent.)`;
      ok.classList.add("show");
      form.reset();
    });
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderProductPage();

  // Render product cards wherever a placeholder asks for one
  document.querySelectorAll("[data-product-card]").forEach(el => {
    el.outerHTML = productCardHTML(PRODUCTS[el.dataset.productCard]);
  });

  // Add-to-bag buttons (event delegation)
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-add]");
    if (b) addToCart(b.dataset.add);
  });

  // Language + currency menu
  const loc = document.querySelector(".locale");
  if (loc) {
    const btn = loc.querySelector(".locale-btn");
    const setOpen = open => { loc.classList.toggle("open", open); btn.setAttribute("aria-expanded", open); };
    btn.addEventListener("click", e => { e.stopPropagation(); setOpen(!loc.classList.contains("open")); });
    document.addEventListener("click", e => { if (!loc.contains(e.target)) setOpen(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
    loc.addEventListener("click", e => {
      const l = e.target.closest("[data-set-lang]"), c = e.target.closest("[data-set-cur]");
      if (l) { state.lang = l.dataset.setLang; store.set("twe_lang", state.lang); applyLanguage(); }
      if (c) { state.currency = c.dataset.setCur; store.set("twe_currency", state.currency); applyPrices(); }
    });
  }

  // Mobile nav
  const nav = document.getElementById("main-nav");
  const toggle = document.getElementById("menu-toggle");
  const backdrop = document.getElementById("nav-backdrop");
  const closeNav = () => { nav.classList.remove("open"); backdrop.classList.remove("show"); toggle.setAttribute("aria-expanded", "false"); };
  if (toggle) {
    toggle.addEventListener("click", () => { nav.classList.add("open"); backdrop.classList.add("show"); toggle.setAttribute("aria-expanded", "true"); });
    document.getElementById("nav-close").addEventListener("click", closeNav);
    backdrop.addEventListener("click", closeNav);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeNav(); });
  }

  // Header border on scroll
  const header = document.getElementById("header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
  }

  bindCart();
  bindForms();
  saveCart();
  applyLanguage();
  applyPrices();
});
