const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, LevelFormat, PageBreak
} = require("docx");

const GOLD = "B38728";
const DARK = "1A1204";
const GREY = "5B5347";

const numbering = {
  config: [
    {
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 420, hanging: 260 } } } }]
    }
  ]
};

function h1(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 } });
}
function h2(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 260, after: 120 } });
}
function p(text, opts = {}) {
  return new Paragraph({ children: [new TextRun({ text, ...opts })], spacing: { after: 140 } });
}
function bullet(text) {
  return new Paragraph({ text, numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 } });
}
function labelValue(label, value) {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({ text: label + " : ", bold: true }),
      new TextRun({ text: value })
    ]
  });
}

function simpleTable(headerRow, rows, columnWidths) {
  const totalWidth = columnWidths.reduce((a, b) => a + b, 0);
  const mkCell = (text, { header = false, width } = {}) => new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: header ? { type: ShadingType.CLEAR, color: "auto", fill: "F2E7C9" } : undefined,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: header, size: 20 })] })]
  });
  const headerTr = new TableRow({
    children: headerRow.map((t, i) => mkCell(t, { header: true, width: columnWidths[i] })),
    tableHeader: true
  });
  const bodyTrs = rows.map((r) => new TableRow({
    children: r.map((t, i) => mkCell(String(t), { width: columnWidths[i] }))
  }));
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths,
    rows: [headerTr, ...bodyTrs]
  });
}

const categories = [
  ["Le plus drôle", "Alphonse YAKPO, Madelaine GAHOUZO, GRODTO, Béatrice"],
  ["Le plus sociable", "Christophe, Domatina, GBATI Grâce, Rebecca KPO, Carlos, Rita"],
  ["Le meilleur Sapeur", "Britney, Blessing, Doogie, Christophe, Aboudou, Camelia"],
  ["Le plus dynamique", "Domatina, Tinès, Pamela, ADOKOU, AGBAGLA, KPODOUH, Femme Alphonse"],
  ["Le plus Humble", "Bonaventure, Ebenezer, Dokita JM, Daniel, Bernice, Elvis, Julio"]
];

const apiEndpoints = [
  ["GET", "/api/config", "Date de l'événement, statut de visibilité des résultats"],
  ["GET", "/api/my-votes", "Votes déjà enregistrés pour l'appareil courant"],
  ["POST", "/api/vote", "Enregistre ou met à jour le vote d'une catégorie"],
  ["GET", "/api/results", "Résultats publics (vides si non révélés par l'organisateur)"],
  ["GET", "/api/admin/results", "Résultats complets (protégé par clé)"],
  ["POST", "/api/admin/settings", "Active/masque la visibilité publique des résultats"],
  ["GET", "/api/admin/export", "Export CSV de tous les votes (protégé par clé)"]
];

const doc = new Document({
  numbering,
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22, color: "1A1204" } }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", run: { size: 30, bold: true, color: GOLD }, paragraph: { spacing: { before: 320, after: 160 } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", run: { size: 25, bold: true, color: DARK }, paragraph: { spacing: { before: 240, after: 120 } } }
    ]
  },
  sections: [
    {
      properties: { page: { size: { width: 11906, height: 16838 } } }, // A4
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 800, after: 100 },
          children: [new TextRun({ text: "CAHIER DES CHARGES", bold: true, size: 48, color: GOLD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
          children: [new TextRun({ text: "Site événementiel & Vote interactif", size: 30, italics: true, color: DARK })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 },
          children: [new TextRun({ text: "Gala Annuel de la Maison Baobab — Édition « Chic & Glamour »", size: 24, color: GREY })] }),

        labelValue("Client / Commanditaire", "Maison Baobab — Université de Lomé, Togo"),
        labelValue("Événement concerné", "Gala Annuel — Samedi 8 Août 2026, Université de Lomé"),
        labelValue("Version du document", "2.0 — Refonte vers frontend statique + backend Python"),
        labelValue("Statut", "Validé pour développement"),

        new Paragraph({ children: [new PageBreak()] }),

        h1("1. Contexte et objectifs"),
        p("La Maison Baobab organise chaque année un Gala destiné à récompenser, par un vote de la promotion, les personnalités marquantes de l'année écoulée (« Le plus drôle », « Le meilleur Sapeur », etc.). Le présent document formalise les exigences fonctionnelles et techniques du site web accompagnant cette édition : présentation de l'événement, vote en ligne sécurisé, galerie photo, et outil de suivi pour l'organisateur."),
        h2("1.1 Objectifs"),
        bullet("Offrir une expérience « Chic & Glamour » mobile-first, cohérente avec l'identité visuelle du Gala (or métallique / noir profond)."),
        bullet("Permettre à chaque participant de voter dans 5 catégories, sans créer de compte."),
        bullet("Empêcher qu'un même appareil vote plusieurs fois dans une catégorie, tout en l'autorisant à modifier son choix."),
        bullet("Donner à l'organisateur un outil pour suivre les votes en direct, révéler les résultats au moment choisi, et exporter les données pour la soirée de remise des prix."),
        bullet("Permettre l'ajout simple des photos de l'édition précédente (galerie) et des nominés."),

        h1("2. Périmètre fonctionnel"),
        h2("2.1 Site public"),
        bullet("Page d'accueil (Hero) : titre animé, décompte vers la date du Gala, bouton d'ajout à l'agenda (fichier .ics)."),
        bullet("Section « À propos » : date, lieu, thème, nombre de catégories."),
        bullet("Galerie photo : carrousel horizontal défilable + frise chronologique des étapes de l'édition précédente ; aperçu en grand format (lightbox)."),
        bullet("Section Vote : navigation par onglets de catégories ; pour chaque nominé, une carte affichant sa photo, un bouton « Voter », et — si l'organisateur les a rendus publics — le nombre de votes et le pourcentage."),
        bullet("Bandeau d'information si l'appareil a déjà voté dans une ou plusieurs catégories, avec possibilité de changer son choix à tout moment."),
        bullet("Bascule de thème clair / sombre, mémorisée par appareil."),
        h2("2.2 Espace organisateur (/admin.html)"),
        bullet("Accès protégé par une clé secrète (paramètre d'URL ou saisie)."),
        bullet("Tableau de résultats en direct par catégorie : décompte par nominé, nominé en tête surligné."),
        bullet("Interrupteur « Résultats visibles publiquement » : contrôle si le site public affiche les pourcentages (permet de garder le suspense jusqu'à la soirée)."),
        bullet("Export CSV de l'ensemble des votes (une ligne par vote), compatible Excel/Google Sheets/LibreOffice."),

        h1("3. Catalogue des catégories et nominés"),
        p("Les catégories et nominés ci-dessous sont ceux de l'édition en cours ; ils sont modifiables dans le code source (frontend/data/categories.js et backend/app.py, qui doivent rester synchronisés)."),
        simpleTable(["Catégorie", "Nominé(e)s"], categories, [2600, 6800]),

        new Paragraph({ children: [new PageBreak()] }),

        h1("4. Exigences non fonctionnelles"),
        h2("4.1 Expérience utilisateur"),
        bullet("Mobile-first, fluide à 60 fps sur smartphone d'entrée de gamme, zones tactiles larges."),
        bullet("Thème visuel « Chic & Glamour » : dégradés or métalliques, glassmorphism, typographies Playfair Display / Plus Jakarta Sans."),
        bullet("Animations : particules dorées en arrière-plan, révélations au défilement, retour visuel immédiat lors du vote."),
        h2("4.2 Performance & disponibilité"),
        bullet("Chargement initial de la page publique inférieur à 2 secondes sur une connexion mobile correcte."),
        bullet("Le backend doit rester disponible pendant toute la période de vote et pendant la soirée du Gala (prévoir une surveillance basique — logs applicatifs)."),
        h2("4.3 Sécurité et anti-fraude"),
        bullet("Un appareil ne peut pas créer deux votes distincts pour la même catégorie (contrainte d'unicité en base de données)."),
        bullet("Un appareil peut revenir modifier son vote à tout moment (mise à jour, jamais de duplication)."),
        bullet("L'empreinte d'appareil (fingerprint) sert de filet de sécurité si les cookies sont effacés entre deux visites."),
        bullet("La zone organisateur est protégée par une clé secrète, à changer avant chaque édition."),
        bullet("Limite assumée : sans système d'authentification fort (ex. vérification par SMS), un utilisateur très déterminé changeant à la fois d'appareil, de navigateur et de cookies pourrait techniquement revoter — limite inhérente à tout vote public sans compte utilisateur."),
        h2("4.4 Accessibilité"),
        bullet("Navigation clavier possible sur les éléments interactifs (onglets, boutons de vote, lightbox)."),
        bullet("Contraste suffisant dans les deux thèmes (clair et sombre)."),
        bullet("Respect de la préférence système « mouvement réduit » (animations désactivées si demandé)."),

        h1("5. Architecture technique"),
        h2("5.1 Frontend"),
        bullet("Architecture : pages statiques HTML/CSS/JavaScript, sans framework JS côté client."),
        bullet("Deux points d'entrée : page publique (index.html) et espace organisateur (admin.html)."),
        bullet("Communication avec le backend en JSON via fetch, cookies inclus (same-origin)."),
        h2("5.2 Backend"),
        bullet("Framework : Python Flask, API de vote + export CSV + service statique.") ,
        bullet("Persistance : base SQLite embarquée en mode fichier (aucune base de données externe à administrer)."),
        bullet("API REST JSON, décrite en section 6."),
        h2("5.3 Déploiement"),
        bullet("Image Docker unique : backend Flask sert le frontend statique depuis le même conteneur."),
        bullet("Déploiement possible sur un service Cloud (Railway, Render, Fly.io), un VPS avec Docker + Nginx + HTTPS (Certbot), ou en local sur le réseau de la salle le soir de l'événement."),

        new Paragraph({ children: [new PageBreak()] }),

        h1("6. Contrat d'API (extrait)"),
        simpleTable(["Méthode", "Endpoint", "Description"], apiEndpoints, [1200, 2600, 5600]),

        h1("7. Modèle de données (simplifié)"),
        h2("7.1 Vote"),
        bullet("voterId (identifiant d'appareil, issu du cookie ou généré)"),
        bullet("categoryId, nominee (le choix)"),
        bullet("fingerprint (empreinte d'appareil, filet de sécurité)"),
        bullet("firstVotedAt, updatedAt (horodatages)"),
        bullet("Contrainte d'unicité : (voterId, categoryId)"),
        h2("7.2 AppSettings"),
        bullet("resultsPublic (booléen) — contrôle la visibilité publique des pourcentages"),

        h1("8. Livrables"),
        bullet("Code source complet (frontend statique + backend Python), avec README d'installation et de déploiement."),
        bullet("Dockerfile et docker-compose.yml prêts à l'emploi."),
        bullet("Présent cahier des charges."),

        h1("9. Hors périmètre (évolutions futures possibles)"),
        bullet("Vérification d'identité forte (SMS / e-mail) pour un anti-fraude renforcé."),
        bullet("Back-office multi-utilisateurs avec rôles différenciés."),
        bullet("Notifications automatiques (SMS/e-mail) aux lauréats."),

        new Paragraph({ text: "", spacing: { before: 600 } }),
        new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: "D6B26E" } },
          spacing: { before: 200 },
          children: [new TextRun({ text: "Maison Baobab — Gala Annuel Chic & Glamour, Édition 2026", italics: true, color: GREY, size: 18 })]
        })
      ]
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  require("fs").writeFileSync("cahier-des-charges-gala-baobab.docx", buffer);
  console.log("OK");
});
