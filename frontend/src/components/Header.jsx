import { useEffect, useState } from "react";

export default function Header({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="header-inner">
        <a href="#hero" className="brand">
          <span className="brand-mark">MB</span>
          <span className="brand-text">Maison <em>Baobab</em></span>
        </a>
        <nav className="site-nav" aria-label="Navigation principale">
          <a href="#about">L'événement</a>
          <a href="#gallery">Galerie</a>
          <a href="#vote">Voter</a>
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" aria-label="Changer de thème" onClick={onToggleTheme}>
            <span className="theme-icon" aria-hidden="true">{theme === "dark" ? "☾" : "☀"}</span>
          </button>
          <a href="#vote" className="btn-gold btn-small header-cta">Voter</a>
        </div>
      </div>
    </header>
  );
}
