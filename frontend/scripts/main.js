let EVENT_DATE = "2026-08-08T18:00:00";

const API_BASE_URL = window.GALA_API_BASE_URL || (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8080"
  : "https://galamb-production.up.railway.app");

const CATEGORIES = [
  {
    id: "plus-drole",
    title: "Le(la) plus drole",
    icon: "🏆",
    description: "Celui ou celle qui a toujours le mot qui fait rire les étudiants de la maison.",
    nominees: [
      { name: "Alphone HAGNABOE", photo: "/photos/Categorie/alphonse.png" },
      { name: "Nestor GAHOUZO", photo: "/photos/Categorie/nestor.jpeg" },
      { name: "Angelo GLODJO", photo: "/photos/Categorie/Angelo.jpeg" },
      { name: "Beatrice AMETODJI", photo: "/photos/Categorie/beatrice.png" }
    ]
  },
  {
    id: "plus-sociable",
    title: "Le plus sociable",
    icon: "🏆",
    description: "Toujours entouré·e et communiquant bien avec tous le monde.",
    nominees: [
      { name: "Domrix GNANSA", photo: "/photos/Categorie/domrix.png" },
      { name: "Irène ADOKOU", photo: "/photos/Categorie/irene.png" },
      { name: "Rebecca KPODOUH", photo: "/photos/Categorie/rebecca.png" },
      { name: "Rita ALOU", photo: "/photos/Categorie/rita.png" }
    ]
  },
  {
    id: "meilleur-sapeur",
    title: "Le(la) meilleur.e Sapeur(se)",
    icon: "🏆",
    description: "L'élégance masculine (et féminine) de la promotion.",
    nominees: [
      { name: "Britney AGBOSSE", photo: "/photos/Categorie/britney.jpeg" },
      { name: "Blessing GBEGLO", photo: "/photos/Categorie/blessing.jpeg" },
      { name: "Doogie AFFONFERE", photo: "/photos/Categorie/bonaventure.png" },
      { name: "Christophe TAKOUBANA", photo: "/photos/Categorie/christophe.png" }
    ]
  },
  {
    id: "plus-dynamique",
    title: "Le(la) plus dynamique",
    icon: "🏆",
    description: "Une énergie qui ne s'éteint jamais, même en fin de semestre.",
    nominees: [
      { name: "Pamela HEGBE", photo: "/photos/Categorie/pamela.png" },
      { name: "Kossivi Tinè KOSSI", photo: "/photos/Categorie/tine.png" },
      { name: "Madelaine DOUTI", photo: "/photos/Categorie/madeleine.png" },
      { name: "Déborah AGBAGLA", photo: "/photos/Categorie/deborah.png" }
    ]
  },
  {
    id: "plus-humble",
    title: "Le(la) plus Humble",
    icon: "🏆",
    description: "Discret·e, mais indispensable.",
    nominees: [
      { name: "Julio ATTIDEKA", photo: "/photos/Categorie/julio.png" },
      { name: "Bernice ANANI", photo: "/photos/Categorie/bernice.png" },
      { name: "Jean-Merc DOKITA", photo: "/photos/Categorie/jean-marc.png" },
      { name: "Daniel BOMBOMA", photo: "/photos/Categorie/daniel.png" },
      { name: "EBenezer HOUSSOU", photo: "/photos/Categorie/ebenezer.png" }
    ]
  }
];

const GALLERY_SLIDES = [
  { id: 1, image: "/photos/Gallery/galagallery1.jpg", caption: "Moments de soirée", layout: "featured" },
  { id: 2, image: "/photos/Gallery/galagallery2.jpg", caption: "Ambiance chic & glamour", layout: "tall" },
  { id: 3, image: "/photos/Gallery/galagallery3.jpg", caption: "Instantané du gala", layout: "wide" },
  { id: 4, image: "/photos/Gallery/galagallery4.jpg", caption: "Un instant magique", layout: "square" },
  { id: 5, image: "/photos/Gallery/galagallery5.jpg", caption: "Soirée inoubliable", layout: "tall" },
  { id: 6, image: "/photos/Gallery/galagallery6.jpg", caption: "Décor élégant", layout: "square" },
  { id: 7, image: "/photos/Gallery/galagallery7.jpg", caption: "Lumières de la soirée", layout: "wide" },
  { id: 8, image: "/photos/Gallery/galagallery8.jpg", caption: "Ambiance festive", layout: "square" },
  { id: 9, image: "/photos/Gallery/galagallery9.jpg", caption: "Moment en groupe", layout: "wide" },
  { id: 10, image: "/photos/Gallery/galagallery10.jpg", caption: "Entre amis", layout: "square" },
  { id: 11, image: "/photos/Gallery/galagallery11.jpg", caption: "Piste de danse", layout: "square" },
  { id: 12, image: "/photos/Gallery/galagallery12.jpg", caption: "La soirée continue", layout: "wide" },
  { id: 13, image: "/photos/Gallery/galagallery13.jpg", caption: "Beau moment", layout: "featured" },
  { id: 14, image: "/photos/Gallery/galagallery14.jpg", caption: "Élégance et style", layout: "tall" },
  { id: 15, image: "/photos/Gallery/galagallery15.jpg", caption: "Ambiance générale", layout: "wide" },
  { id: 16, image: "/photos/Gallery/galagallery16.jpg", caption: "Souvenir précieux", layout: "square" },
  { id: 17, image: "/photos/Gallery/galagallery17.jpg", caption: "Détail de décoration", layout: "tall" },
  { id: 18, image: "/photos/Gallery/galagallery18.jpg", caption: "Rayons de lumière", layout: "square" },
  { id: 19, image: "/photos/Gallery/galagallery19.jpg", caption: "Moment de joie", layout: "wide" },
  { id: 20, image: "/photos/Gallery/galagallery20.jpg", caption: "Convivialité", layout: "square" },
  { id: 21, image: "/photos/Gallery/galagallery21.jpg", caption: "Danse et musique", layout: "square" },
  { id: 22, image: "/photos/Gallery/galagallery22.jpg", caption: "Minuit au gala", layout: "wide" },
  { id: 23, image: "/photos/Gallery/galagallery23.jpg", caption: "Sourires de la nuit", layout: "featured" },
  { id: 24, image: "/photos/Gallery/galagallery24.jpg", caption: "Entre sérénité", layout: "tall" },
  { id: 25, image: "/photos/Gallery/galagallery25.jpg", caption: "Ambiance générale", layout: "wide" },
  { id: 26, image: "/photos/Gallery/galagallery26.jpg", caption: "Dernier cliché", layout: "square" },
  { id: 27, image: "/photos/Gallery/galagallery27.jpg", caption: "Mémoire de la soirée", layout: "tall" },
  { id: 28, image: "/photos/Gallery/galagallery28.jpg", caption: "Au revoir gala 2025", layout: "square" }
];

function getFingerprint() {
  const nav = window.navigator;
  const raw = [
    nav.userAgent || "",
    nav.language || "",
    (nav.languages || []).join(","),
    String(nav.hardwareConcurrency || ""),
    String(nav.maxTouchPoints || ""),
    nav.platform || "",
    `${screen.width}x${screen.height}`,
    String(screen.colorDepth || ""),
    String(window.devicePixelRatio || ""),
    String(-new Date().getTimezoneOffset()),
    Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    getCanvasSignature()
  ].join("###");
  const hash = raw.split("").reduce((hash, ch) => ((hash * 33) ^ ch.charCodeAt(0)) >>> 0, 5381);
  return `${hash.toString(36)}-${((raw.split("").reverse().reduce((hash, ch) => ((hash * 33) ^ ch.charCodeAt(0)) >>> 0, 5381))).toString(36)}`;
}

function getCanvasSignature() {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 220;
    canvas.height = 40;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";
    ctx.textBaseline = "top";
    ctx.font = "16px 'Plus Jakarta Sans', Arial";
    ctx.fillStyle = "#f60";
    ctx.fillRect(0, 0, 60, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("GalaBaobab~2026", 2, 12);
    ctx.strokeStyle = "rgba(102, 204, 0, 0.7)";
    ctx.beginPath();
    ctx.arc(50, 20, 18, 0, Math.PI * 2);
    ctx.stroke();
    return canvas.toDataURL();
  } catch (e) {
    return "canvas-error";
  }
}

function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  return fetch(url, { credentials: "include", ...options }).then(async (res) => {
    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await res.json() : await res.text();
    if (!res.ok) {
      const message = (body && body.error) || `Erreur serveur (${res.status})`;
      throw new Error(message);
    }
    return body;
  });
}

function fetchConfig() {
  return apiFetch("/api/config");
}

function fetchMyVotes() {
  return apiFetch(`/api/my-votes?fingerprint=${encodeURIComponent(getFingerprint())}`);
}

function submitVote(categoryId, nominee) {
  return apiFetch("/api/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryId, nominee, fingerprint: getFingerprint() })
  });
}

function fetchPublicResults() {
  return apiFetch("/api/results");
}

function adminSetResultsPublic(key, resultsPublic) {
  return apiFetch(`/api/admin/settings?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resultsPublic })
  });
}

function formatCountdown(value) {
  return String(value).padStart(2, "0");
}

function createHeroSection(config) {
  const hero = document.createElement("section");
  hero.id = "hero";
  hero.className = "hero";
  hero.innerHTML = `
    <div class="hero-content">
      <p class="eyebrow">Maison Baobab — Université de Lomé, Togo</p>
      <h1 class="hero-title">
        Gala&nbsp;Annuel
        <span class="hero-title-accent">Chic&nbsp;&amp;&nbsp;Glamour</span>
      </h1>
      <p class="hero-sub">Samedi 8 Août 2026 · Université de Lomé</p>
      <div class="countdown" role="timer" aria-live="off">
        <div class="cd-unit"><span class="cd-value" id="countdown-days">00</span><span class="cd-label">Jours</span></div>
        <div class="cd-sep">:</div>
        <div class="cd-unit"><span class="cd-value" id="countdown-hours">00</span><span class="cd-label">Heures</span></div>
        <div class="cd-sep">:</div>
        <div class="cd-unit"><span class="cd-value" id="countdown-minutes">00</span><span class="cd-label">Minutes</span></div>
        <div class="cd-sep">:</div>
        <div class="cd-unit"><span class="cd-value" id="countdown-seconds">00</span><span class="cd-label">Secondes</span></div>
      </div>
      <div class="hero-actions">
        <button class="btn-gold btn-large" type="button" id="hero-vote-button">Voter maintenant</button>
      </div>
      <button class="scroll-cue" type="button" aria-label="Voir la section événement">
        <span class="scroll-cue-line"></span>
      </button>
    </div>
  `;

  hero.querySelector("#hero-vote-button").addEventListener("click", () => {
    document.getElementById("vote")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  hero.querySelector(".scroll-cue").addEventListener("click", () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  return hero;
}

function parseISOLocal(iso) {
  if (!iso) return null;
  const m = iso.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return new Date(iso);
  const year = Number(m[1]);
  const month = Number(m[2]) - 1;
  const day = Number(m[3]);
  const hour = Number(m[4]);
  const minute = Number(m[5]);
  const second = Number(m[6] || 0);
  return new Date(year, month, day, hour, minute, second);
}


function createAboutSection() {
  const section = document.createElement("section");
  section.id = "about";
  section.className = "about";
  section.innerHTML = `
    <div class="section-inner">
      <p class="section-eyebrow reveal">01 — L'événement</p>
      <h2 class="section-title reveal">Une nuit taillée pour l'excellence</h2>
      <p class="about-text reveal">La Maison Baobab célèbre une nouvelle année d'unité, d'élégance et de mémoire. Le temps d'une soirée, l'Université de Lomé se pare d'or pour récompenser les personnalités qui ont marqué la promotion. Habillez-vous, votez, et soyez présents pour la remise des prix.</p>
      <div class="about-grid">
        <div class="about-card reveal"><span class="about-card-icon">◆</span><h3>Date</h3><p>Samedi 8 Août 2026</p></div>
        <div class="about-card reveal"><span class="about-card-icon">◆</span><h3>Lieu</h3><p>Université de Lomé, Togo</p></div>
        <div class="about-card reveal"><span class="about-card-icon">◆</span><h3>Thème</h3><p>Chic &amp; Glamour</p></div>
        <div class="about-card reveal"><span class="about-card-icon">◆</span><h3>Catégories</h3><p>5 titres à décerner</p></div>
      </div>
    </div>
  `;
  return section;
}

function createGallerySection() {
  const section = document.createElement("section");
  section.id = "gallery";
  section.className = "gallery-section";
  section.innerHTML = `
    <div class="section-inner">
      <div class="gallery-header reveal">
        <h2 class="section-title">L'édition précédente en images</h2>
      </div>
      <div class="gallery-grid-wrap reveal" id="gallery-grid"></div>
    </div>
  `;

  const grid = section.querySelector("#gallery-grid");
  GALLERY_SLIDES.forEach((slide) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `gallery-tile ${slide.layout === "featured" ? "is-featured" : slide.layout === "wide" ? "is-wide" : slide.layout === "tall" ? "is-tall" : ""}`.trim();
    const frame = document.createElement("div");
    frame.className = "gallery-tile-inner";
    frame.innerHTML = `<img src="${slide.image}" alt="${slide.caption}" loading="lazy">`;
    button.appendChild(frame);
    button.addEventListener("click", () => openLightbox(slide));
    grid.appendChild(button);
  });

  return section;
}

function openLightbox(slide) {
  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay is-open";
  overlay.role = "dialog";
  overlay.ariaModal = "true";
  overlay.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Fermer">✕</button>
    <img class="lightbox-img" src="${slide.image}" alt="${slide.caption}">
    <span class="lightbox-caption">${slide.caption}</span>
  `;
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target.closest(".lightbox-close")) {
      overlay.remove();
    }
  });
  document.body.appendChild(overlay);
}

function createVoteSection() {
  const section = document.createElement("section");
  section.id = "vote";
  section.className = "vote-section";
  section.innerHTML = `
    <div class="section-inner">
      <p class="section-eyebrow reveal">03 — Le vote</p>
      <h2 class="section-title reveal">Exprimez votre voix</h2>
      <p class="about-text reveal">Un vote par catégorie et par appareil — vous pouvez revenir à tout moment changer votre choix, il remplacera simplement le précédent.</p>
      <div id="vote-status" class="vote-status-banner" style="display:none"></div>
      <div class="category-tabs reveal" id="category-tabs" role="tablist"></div>
      <div class="category-panel-header reveal">
        <h3 class="category-panel-title" id="active-category-title"></h3>
        <span class="category-panel-total" id="active-category-total"></span>
      </div>
      <p class="category-panel-desc reveal" id="active-category-desc"></p>
      <div class="nominee-grid reveal" id="nominee-grid"></div>
    </div>
    <div class="vote-toast" id="vote-toast" style="display:none"></div>
  `;

  return section;
}

function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="section-inner footer-inner">
      <p class="brand-text footer-brand">Maison <em>Baobab</em></p>
      <p class="footer-copy">Gala Annuel — Chic &amp; Glamour · 8 Août 2026 · Université de Lomé, Togo</p>
    </div>
  `;
  return footer;
}

function createHeader() {
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="header-inner">
      <a href="#hero" class="brand">
        <span class="brand-mark">MB</span>
        <span class="brand-text">Maison <em>Baobab</em></span>
      </a>
      <nav class="site-nav" aria-label="Navigation principale">
        <a href="#about">L'événement</a>
        <a href="#gallery">Galerie</a>
        <a href="#vote">Voter</a>
      </nav>
      <div class="header-actions">
        <button class="theme-toggle" type="button" id="theme-toggle" aria-label="Changer de thème"><span class="theme-icon">☾</span></button>
        <a href="#vote" class="btn-gold btn-small header-cta">Voter</a>
      </div>
    </div>
  `;

  const themeToggle = header.querySelector("#theme-toggle");
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.querySelector(".theme-icon").textContent = nextTheme === "dark" ? "☾" : "☀";
    localStorage.setItem("gala-theme", nextTheme);
  });

  return header;
}

function loadTheme() {
  const stored = localStorage.getItem("gala-theme");
  const theme = stored === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme);
  const icon = document.querySelector(".theme-icon");
  if (icon) icon.textContent = theme === "dark" ? "☾" : "☀";
}

function useCountdown() {
  const target = parseISOLocal(EVENT_DATE) || new Date(EVENT_DATE);
  const now = new Date();
  if (!target || isNaN(target.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const diff = Math.max(0, target.getTime() - now.getTime());
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60
  };
}

function updateCountdown() {
  const cd = useCountdown();
  document.getElementById("countdown-days").textContent = formatCountdown(cd.days);
  document.getElementById("countdown-hours").textContent = formatCountdown(cd.hours);
  document.getElementById("countdown-minutes").textContent = formatCountdown(cd.minutes);
  document.getElementById("countdown-seconds").textContent = formatCountdown(cd.seconds);
}

function createVoteCard(category, nominee, isMyVote, count, percent, resultsPublic, isSubmitting, onVote) {
  const card = document.createElement("div");
  card.className = `nominee-card${isMyVote ? " is-my-vote" : ""}`;
  card.innerHTML = `
    <div class="nominee-photo-wrap">
      <img src="${nominee.photo}" alt="${nominee.name}" loading="lazy">
      ${isMyVote ? '<span class="nominee-my-vote-badge" title="Votre vote actuel">✓</span>' : ""}
    </div>
    <div class="nominee-body">
      <p class="nominee-name">${nominee.name}</p>
      ${resultsPublic ? `<div class="nominee-stats"><span>${count} vote${count === 1 ? "" : "s"}</span><span class="nominee-percent">${percent}%</span></div><div class="nominee-bar-track"><div class="nominee-bar-fill" style="width: ${percent}%"></div></div>` : `<p class="results-hidden-note">Résultats masqués jusqu'à la soirée du Gala</p>`}
      <button class="btn-vote${isMyVote ? " is-active" : ""}" type="button" ${isSubmitting ? "disabled" : ""}>${isMyVote ? "✓ Voté" : isSubmitting ? "…" : "Voter"}</button>
    </div>
  `;
  const button = card.querySelector("button");
  button.addEventListener("click", onVote);
  return card;
}

function renderVotes(myVotes, results) {
  const activeTab = selectedCategoryId || CATEGORIES[0].id;
  const activeCategory = CATEGORIES.find((c) => c.id === activeTab);
  const voteStatus = document.getElementById("vote-status");
  const totalVoted = Object.keys(myVotes).length;

  if (!backendOffline) {
    voteStatus.style.display = totalVoted > 0 ? "block" : "none";
    voteStatus.textContent = totalVoted > 0
      ? `Vous avez déjà voté dans ${totalVoted}/${CATEGORIES.length} catégorie${totalVoted > 1 ? "s" : ""}. Cliquez sur « Voter » à nouveau pour changer un choix.`
      : "";
  }

  const tabs = document.getElementById("category-tabs");
  tabs.innerHTML = "";
  CATEGORIES.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", category.id === activeTab ? "true" : "false");
    button.className = `category-tab${category.id === activeTab ? " is-active" : ""}`;
    button.innerHTML = `<span class="tab-icon" aria-hidden="true">${category.icon}</span>${category.title}${myVotes[category.id] ? " ✓" : ""}`;
    button.addEventListener("click", () => {
      selectedCategoryId = category.id;
      renderVotes(myVotes, results);
    });
    tabs.appendChild(button);
  });

  document.getElementById("active-category-title").textContent = activeCategory.title;
  document.getElementById("active-category-desc").textContent = activeCategory.description;
  document.getElementById("active-category-total").textContent = results.resultsPublic ? `${results.tally[activeCategory.id]?.totalVotes || 0} votes au total` : "";

  const grid = document.getElementById("nominee-grid");
  grid.innerHTML = "";
  activeCategory.nominees.forEach((nominee) => {
    const count = results.tally[activeCategory.id]?.counts?.[nominee.name] || 0;
    const total = results.tally[activeCategory.id]?.totalVotes || 0;
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    const isMyVote = myVotes[activeCategory.id] === nominee.name;
    const card = createVoteCard(
      activeCategory,
      nominee,
      isMyVote,
      count,
      percent,
      results.resultsPublic,
      false,
      () => submitVote(activeCategory.id, nominee.name)
        .then((res) => {
          myVotes[activeCategory.id] = nominee.name;
          showToast(res.isUpdate ? "Vote mis à jour ✦" : "Vote enregistré ✦");
          return fetchPublicResults();
        })
        .then((updated) => {
          Object.assign(results, updated);
          renderVotes(myVotes, results);
        })
        .catch((e) => showToast(e.message || "Une erreur est survenue."))
    );
    grid.appendChild(card);
  });
}

let selectedCategoryId = null;
let backendOffline = false;

function showToast(message) {
  const toast = document.getElementById("vote-toast");
  toast.style.display = "block";
  toast.textContent = message;
  window.clearTimeout(toast.dataset.timeout);
  toast.dataset.timeout = window.setTimeout(() => {
    toast.style.display = "none";
  }, 3200);
}

function renderAdminPage() {
  const root = document.getElementById("root");
  root.innerHTML = "";

  const title = document.createElement("h1");
  title.className = "admin-title";
  title.textContent = "Espace organisateur";

  const subtitle = document.createElement("p");
  subtitle.className = "admin-sub";
  subtitle.textContent = "Résultats en direct du Gala Baobab — visibles uniquement avec la clé administrateur.";

  const gate = document.createElement("div");
  gate.className = "admin-gate";
  gate.innerHTML = `
    <input type="password" placeholder="Clé administrateur" autocomplete="off" id="admin-key-input">
    <button class="btn-gold" type="button" id="admin-load-button">Afficher les résultats</button>
    <button class="theme-toggle" type="button" id="admin-theme-toggle" aria-label="Changer de thème"><span class="theme-icon">☾</span></button>
  `;

  const error = document.createElement("p");
  error.className = "error-msg";
  error.style.display = "none";

  const summary = document.createElement("p");
  summary.className = "admin-summary";

  const container = document.createElement("div");
  container.id = "admin-content";

  root.append(title, subtitle, gate, error, summary, container);

  const input = gate.querySelector("#admin-key-input");
  const loadButton = gate.querySelector("#admin-load-button");
  const themeButton = gate.querySelector("#admin-theme-toggle");

  loadButton.addEventListener("click", loadAdminData);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") loadAdminData();
  });
  themeButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    themeButton.querySelector(".theme-icon").textContent = nextTheme === "dark" ? "☾" : "☀";
    localStorage.setItem("gala-theme", nextTheme);
  });

  const savedKey = new URLSearchParams(window.location.search).get("key") || localStorage.getItem("gala-admin-key") || "";
  input.value = savedKey;

  if (savedKey) {
    loadAdminData();
  }

  function loadAdminData() {
    const key = input.value.trim();
    if (!key) {
      showAdminError("Entrez la clé administrateur.");
      return;
    }
    error.style.display = "none";
    fetch(`/api/admin/results?key=${encodeURIComponent(key)}`, { credentials: "same-origin" })
      .then((res) => res.ok ? res.json() : res.json().then((body) => Promise.reject(body.error || "Erreur serveur")))
      .then((data) => {
        localStorage.setItem("gala-admin-key", key);
        renderAdminData(data, key);
      })
      .catch((err) => showAdminError(err || "Erreur serveur"));
  }

  function showAdminError(message) {
    error.style.display = "block";
    error.textContent = message;
  }

  function renderAdminData(data, key) {
    summary.textContent = `${data.totalVoters} appareil(s) ayant voté au total (toutes catégories confondues).`;
    container.innerHTML = "";

    const toggleRow = document.createElement("div");
    toggleRow.className = "admin-toggle-row";
    toggleRow.innerHTML = `
      <p><strong>Résultats visibles publiquement</strong><br>${data.resultsPublic ? "Les votants voient les pourcentages en direct sur le site." : "Les votants ne voient pas encore les pourcentages (idéal avant la soirée du Gala)."}</p>
      <button class="switch${data.resultsPublic ? " is-on" : ""}" type="button" aria-pressed="${data.resultsPublic}" id="results-switch"><span class="switch-knob"></span></button>
    `;
    container.appendChild(toggleRow);

    const switchButton = toggleRow.querySelector("#results-switch");
    switchButton.addEventListener("click", () => {
      const nextValue = !data.resultsPublic;
      fetch(`/api/admin/settings?key=${encodeURIComponent(key)}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultsPublic: nextValue })
      })
        .then((res) => res.ok ? res.json() : res.json().then((body) => Promise.reject(body.error || "Erreur serveur")))
        .then((updated) => renderAdminData(updated, key))
        .catch((err) => showAdminError(err || "Erreur serveur"));
    });

    Object.values(data.tally).forEach((cat) => {
      const catBlock = document.createElement("div");
      catBlock.className = "cat-block";
      const sorted = Object.entries(cat.counts).sort((a, b) => b[1] - a[1]);
      catBlock.innerHTML = `
        <h2>${cat.title}</h2>
        <p class="cat-winner">${cat.winnerCount > 0 ? `🏆 En tête : ${cat.winner} (${cat.winnerCount} voix)` : "Aucun vote pour le moment."}</p>
      `;

      sorted.forEach(([name, count]) => {
        const row = document.createElement("div");
        row.className = "bar-row";
        row.innerHTML = `
          <span class="bar-name">${name}</span>
          <span class="bar-track"><span class="bar-fill" style="width: ${(count / Math.max(1, sorted[0][1])) * 100}%"></span></span>
          <span class="bar-count">${count}</span>
        `;
        catBlock.appendChild(row);
      });

      container.appendChild(catBlock);
    });

    const actions = document.createElement("div");
    actions.className = "admin-actions";
    actions.innerHTML = `<a class="btn-gold" href="${adminExportUrl(key)}">⬇ Exporter les votes (CSV pour Excel)</a>`;
    container.appendChild(actions);
  }
}

function adminExportUrl(key) {
  return `/api/admin/export?key=${encodeURIComponent(key)}`;
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function initParticles() {
  const canvas = document.createElement("canvas");
  canvas.id = "particles-canvas";
  canvas.setAttribute("aria-hidden", "true");
  const grain = document.createElement("div");
  grain.className = "grain-overlay";
  document.body.appendChild(canvas);
  document.body.appendChild(grain);

  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  const density = window.innerWidth < 640 ? 45 : 90;
  let particles = [];
  let rafId;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function particleRGB() {
    return getComputedStyle(document.documentElement).getPropertyValue("--particle-color").trim() || "252, 246, 186";
  }

  function createParticles() {
    particles = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.6 + Math.random() * 1.8,
      baseAlpha: 0.15 + Math.random() * 0.5,
      speedY: 0.08 + Math.random() * 0.22,
      driftX: (Math.random() - 0.5) * 0.18,
      phase: Math.random() * Math.PI * 2
    }));
  }

  let t = 0;
  function draw() {
    const rgb = particleRGB();
    ctx.clearRect(0, 0, width, height);
    t += 0.016;
    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.driftX + Math.sin(t + p.phase) * 0.06;
      if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const twinkle = 0.6 + 0.4 * Math.sin(t * 1.4 + p.phase);
      const alpha = p.baseAlpha * twinkle;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      gradient.addColorStop(0, `rgba(${rgb}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    });
    if (!reducedMotion) rafId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener("resize", () => { resize(); createParticles(); });
}

function hydratePage() {
  loadTheme();
  const root = document.getElementById("root");
  root.innerHTML = "";
  root.appendChild(createHeader());
  const main = document.createElement("main");
  main.appendChild(createHeroSection());
  main.appendChild(createAboutSection());
  main.appendChild(createGallerySection());
  main.appendChild(createVoteSection());
  root.appendChild(main);
  root.appendChild(createFooter());
  initReveal();
  initParticles();

  const state = {
    myVotes: {},
    results: { resultsPublic: false, tally: {} }
  };

  Promise.all([fetchConfig(), fetchMyVotes(), fetchPublicResults()])
    .then(([config, mine, publicResults]) => {
      EVENT_DATE = config.eventDate || EVENT_DATE;
      // If the reveal time (22:00 local) has passed on the event date, force
      // results visible client-side as a fallback.
      const eventDateObj = parseISOLocal(EVENT_DATE) || new Date(EVENT_DATE);
      const revealAt = new Date(eventDateObj.getFullYear(), eventDateObj.getMonth(), eventDateObj.getDate(), 22, 0, 0);
      if (new Date() >= revealAt) {
        publicResults.resultsPublic = true;
      }
      state.myVotes = mine.votes || {};
      state.results = publicResults;
      backendOffline = false;
      renderVotes(state.myVotes, state.results);
    })
    .catch(() => {
      backendOffline = true;
      document.getElementById("vote-status").style.display = "block";
      document.getElementById("vote-status").textContent = "⚠ Le serveur de vote est actuellement inaccessible. Démarrez le backend Python pour voter.";
      renderVotes(state.myVotes, state.results);
    });

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

if (window.location.pathname.endsWith("admin.html")) {
  loadTheme();
  document.querySelector("body").classList.add("admin-page");
  renderAdminPage();
} else {
  hydratePage();
}
