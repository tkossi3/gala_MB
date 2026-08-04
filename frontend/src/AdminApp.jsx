import { useEffect, useState } from "react";
import ParticleBackground from "./components/ParticleBackground";
import { adminExportUrl, adminFetchResults, adminSetResultsPublic } from "./api";
import { useTheme } from "./hooks/useTheme";

export default function AdminApp() {
  const { theme, toggleTheme } = useTheme();
  const [key, setKey] = useState(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("key");
    if (fromUrl) return fromUrl;
    try { return sessionStorage.getItem("gala-admin-key") || ""; } catch { return ""; }
  });
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(false);

  async function load() {
    if (!key.trim()) return;
    setError("");
    try {
      const res = await adminFetchResults(key.trim());
      setData(res);
      try { sessionStorage.setItem("gala-admin-key", key.trim()); } catch { /* ignore */ }
    } catch (e) {
      setError(e.message);
      setData(null);
    }
  }

  useEffect(() => { if (key) load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleToggleResults() {
    if (!data) return;
    setToggling(true);
    try {
      await adminSetResultsPublic(key.trim(), !data.resultsPublic);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setToggling(false);
    }
  }

  return (
    <>
      <ParticleBackground theme={theme} />
      <div className="admin-wrap">
        <h1 className="admin-title">Espace organisateur</h1>
        <p className="admin-sub">Résultats en direct du Gala Baobab — visibles uniquement avec la clé administrateur.</p>

        <div className="admin-gate">
          <input
            type="password"
            placeholder="Clé administrateur"
            autoComplete="off"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") load(); }}
          />
          <button className="btn-gold" type="button" onClick={load}>Afficher les résultats</button>
          <button className="theme-toggle" type="button" aria-label="Changer de thème" onClick={toggleTheme}>
            <span className="theme-icon">{theme === "dark" ? "☾" : "☀"}</span>
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}

        {data && (
          <>
            <p className="admin-summary">{data.totalVoters} appareil(s) ayant voté au total (toutes catégories confondues).</p>

            <div className="admin-toggle-row">
              <p>
                <strong>Résultats visibles publiquement</strong><br />
                {data.resultsPublic
                  ? "Les votants voient les pourcentages en direct sur le site."
                  : "Les votants ne voient pas encore les pourcentages (idéal avant la soirée du Gala)."}
              </p>
              <button
                type="button"
                className={`switch${data.resultsPublic ? " is-on" : ""}`}
                aria-pressed={data.resultsPublic}
                onClick={handleToggleResults}
                disabled={toggling}
              >
                <span className="switch-knob" />
              </button>
            </div>

            {Object.values(data.tally).map((cat) => {
              const max = Math.max(1, ...Object.values(cat.counts));
              const sorted = Object.entries(cat.counts).sort((a, b) => b[1] - a[1]);
              return (
                <div className="cat-block" key={cat.title}>
                  <h2>{cat.title}</h2>
                  <p className="cat-winner">
                    {cat.winnerCount > 0 ? `🏆 En tête : ${cat.winner} (${cat.winnerCount} voix)` : "Aucun vote pour le moment."}
                  </p>
                  {sorted.map(([name, count]) => (
                    <div className="bar-row" key={name}>
                      <span className="bar-name">{name}</span>
                      <span className="bar-track"><span className="bar-fill" style={{ width: `${(count / max) * 100}%` }} /></span>
                      <span className="bar-count">{count}</span>
                    </div>
                  ))}
                </div>
              );
            })}

            <div className="admin-actions">
              <a className="btn-gold" href={adminExportUrl(key.trim())}>⬇ Exporter les votes (CSV pour Excel)</a>
            </div>
          </>
        )}
      </div>
    </>
  );
}
