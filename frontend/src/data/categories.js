/* =====================================================================
   Catégories & nominés du Gala.
   Chaque nominé a un champ `photo` : une image placeholder (picsum.photos)
   à remplacer par une vraie photo. Voir le README ("Charger vos photos")
   pour la marche à suivre — il suffit de changer la valeur de `photo`.
   ===================================================================== */

// Génère une image placeholder stable (même nom = même image) à remplacer.
const placeholder = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/480/480`;

export const CATEGORIES = [
  {
    id: "plus-drole",
    title: "Le plus drôle",
    icon: "🏆",
    description: "Celui ou celle qui a toujours le mot qui fait rire toute la promo.",
    nominees: [
      { name: "Amorin YAKPO", photo: placeholder("plus-drole-1") },
      { name: "Nestor GAHOUZO", photo: placeholder("plus-drole-2") },
      { name: "Angelo GLODJO", photo: placeholder("plus-drole-3") },
      { name: "Béatrice ANANI", photo: placeholder("plus-drole-4") }
    ]
  },
  {
    id: "plus-sociable",
    title: "Le plus sociable",
    icon: "🏆",
    description: "Toujours entouré·e, jamais avare d'un bonjour ou d'un service.",
    nominees: [
      { name: "Christophe TAKOUBANA", photo: placeholder("plus-sociable-1") },
      { name: "Boris DOMATINA", photo: placeholder("plus-sociable-2") },
      { name: "Grâce GBATI", photo: placeholder("plus-sociable-3") },
      { name: "Rebecca KPODOUH", photo: placeholder("plus-sociable-4") },
      { name: "Carlos OLYMPIO", photo: placeholder("plus-sociable-5") },
      { name: "Rita ", photo: placeholder("plus-sociable-6") }
    ]
  },
  {
    id: "meilleur-sapeur",
    title: "Le meilleur Sapeur",
    icon: "🏆",
    description: "L'élégance masculine (et féminine) de la promotion.",
    nominees: [
      { name: "Britney AGBOSSE", photo: placeholder("meilleur-sapeur-1") },
      { name: "Blessing GBEGLO", photo: placeholder("meilleur-sapeur-2") },
      { name: "Doogie AFFONFERE", photo: placeholder("meilleur-sapeur-3") },
      { name: "Christophe TAKOUBANA", photo: placeholder("meilleur-sapeur-4") },
      { name: "Aboudou ISSA", photo: placeholder("meilleur-sapeur-5") },
      { name: "Camelia LOWSON", photo: placeholder("meilleur-sapeur-6") }
    ]
  },
  {
    id: "plus-dynamique",
    title: "Le plus dynamique",
    icon: "🏆",
    description: "Une énergie qui ne s'éteint jamais, même en fin de semestre.",
    nominees: [
      { name: "Boris DOMATINA", photo: placeholder("plus-dynamique-1") },
      { name: "Kossivi Tinè KOSSI", photo: placeholder("plus-dynamique-2") },
      { name: "Pamela HEGBE", photo: placeholder("plus-dynamique-3") },
      { name: "Irène ADOKOU", photo: placeholder("plus-dynamique-4") },
      { name: "AGBAGLA", photo: placeholder("plus-dynamique-5") },
      { name: "Rebecca KPODOUH", photo: placeholder("plus-dynamique-6") },
      { name: "Femme Alphonse", photo: placeholder("plus-dynamique-7") }
    ]
  },
  {
    id: "plus-humble",
    title: "Le plus Humble",
    icon: "🏆",
    description: "Discret·e, mais indispensable à l'équilibre du groupe.",
    nominees: [
      { name: "Bonaventure AFFONFERE", photo: placeholder("plus-humble-1") },
      { name: "Ebenezer HOUSSOU", photo: placeholder("plus-humble-2") },
      { name: "Jean-Merc DOKITA", photo: placeholder("plus-humble-3") },
      { name: "Daniel BOMBOMA", photo: placeholder("plus-humble-4") },
      { name: "Bernice ANANI", photo: placeholder("plus-humble-5") },
      { name: "Elvis", photo: placeholder("plus-humble-6") },
      { name: "Julio", photo: placeholder("plus-humble-7") }
    ]
  }
];
