export default function About() {
  return (
    <section id="about" className="about">
      <div className="section-inner">
        <p className="section-eyebrow reveal">01 — L'événement</p>
        <h2 className="section-title reveal">Une nuit taillée pour l'excellence</h2>
        <p className="about-text reveal">
          La Maison Baobab célèbre une nouvelle année d'unité, d'élégance et de mémoire.
          Le temps d'une soirée, l'Université de Lomé se pare d'or pour récompenser les
          personnalités qui ont marqué la promotion. Habillez-vous, votez, et soyez
          présents pour la remise des prix.
        </p>
        <div className="about-grid">
          <div className="about-card reveal"><span className="about-card-icon">◆</span><h3>Date</h3><p>Samedi 8 Août 2026</p></div>
          <div className="about-card reveal"><span className="about-card-icon">◆</span><h3>Lieu</h3><p>Université de Lomé, Togo</p></div>
          <div className="about-card reveal"><span className="about-card-icon">◆</span><h3>Thème</h3><p>Chic &amp; Glamour</p></div>
          <div className="about-card reveal"><span className="about-card-icon">◆</span><h3>Catégories</h3><p>5 titres à décerner</p></div>
        </div>
      </div>
    </section>
  );
}
