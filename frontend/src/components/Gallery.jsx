import { useState } from "react";
import { GALLERY_SLIDES } from "../data/gallery";

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="gallery" className="gallery-section">
      <div className="section-inner">
        <div className="gallery-header reveal">
          <h2 className="section-title">L'édition précédente en images</h2>
        </div>

        <div className="gallery-grid-wrap reveal">
          {GALLERY_SLIDES.map((slide) => {
            const layoutClass = slide.layout === "featured"
              ? "is-featured"
              : slide.layout === "wide"
                ? "is-wide"
                : slide.layout === "tall"
                  ? "is-tall"
                  : "";

            return (
              <button
                key={slide.id}
                type="button"
                className={`gallery-tile ${layoutClass}`.trim()}
                onClick={() => setLightbox(slide)}
              >
                <img src={slide.image} alt={slide.caption} loading="lazy" />
              </button>
            );
          })}
        </div>
      </div>

      {lightbox && (
        <div className="lightbox-overlay is-open" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" type="button" aria-label="Fermer" onClick={() => setLightbox(null)}>✕</button>
          <img className="lightbox-img" src={lightbox.image} alt={lightbox.caption} />
          <span className="lightbox-caption">{lightbox.caption}</span>
        </div>
      )}
    </section>
  );
}
