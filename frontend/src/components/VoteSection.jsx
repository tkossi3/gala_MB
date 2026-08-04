import { useEffect, useMemo, useState } from "react";
import { CATEGORIES } from "../data/categories";
import { fetchMyVotes, fetchPublicResults, submitVote } from "../api";
import NomineeCard from "./NomineeCard";

export default function VoteSection() {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);
  const [myVotes, setMyVotes] = useState({});
  const [results, setResults] = useState({ resultsPublic: false, tally: {} });
  const [submittingKey, setSubmittingKey] = useState(null); // `${catId}:${nominee}` en cours d'envoi
  const [backendOffline, setBackendOffline] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    Promise.all([fetchMyVotes(), fetchPublicResults()])
      .then(([mine, publicResults]) => {
        setMyVotes(mine.votes || {});
        setResults(publicResults);
      })
      .catch(() => setBackendOffline(true));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  const activeCategory = useMemo(() => CATEGORIES.find((c) => c.id === activeTab), [activeTab]);
  const votedCount = Object.keys(myVotes).length;

  async function handleVote(categoryId, nominee) {
    const key = `${categoryId}:${nominee}`;
    setSubmittingKey(key);
    try {
      const res = await submitVote(categoryId, nominee);
      setMyVotes((prev) => ({ ...prev, [categoryId]: nominee }));
      // Rafraîchit les compteurs publics (s'ils sont visibles) après le vote
      fetchPublicResults().then(setResults).catch(() => {});
      setToast(res.isUpdate ? "Vote mis à jour ✦" : "Vote enregistré ✦");
    } catch (e) {
      setToast(e.message || "Une erreur est survenue.");
    } finally {
      setSubmittingKey(null);
    }
  }

  function tallyFor(categoryId, nomineeName) {
    const catTally = results.tally?.[categoryId];
    const count = catTally?.counts?.[nomineeName] ?? 0;
    const total = catTally?.totalVotes ?? 0;
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    return { count, percent };
  }

  const activeTotal = results.tally?.[activeTab]?.totalVotes ?? 0;

  return (
    <section id="vote" className="vote-section">
      <div className="section-inner">
        <p className="section-eyebrow reveal">03 — Le vote</p>
        <h2 className="section-title reveal">Exprimez votre voix</h2>
        <p className="about-text reveal">
          Un vote par catégorie et par appareil — vous pouvez revenir à tout moment
          changer votre choix, il remplacera simplement le précédent.
        </p>

        {backendOffline && (
          <p className="vote-status-banner">
            ⚠ Le serveur de vote est actuellement inaccessible. Démarrez le backend Spring Boot pour voter.
          </p>
        )}
        {!backendOffline && votedCount > 0 && (
          <p className="vote-status-banner">
            Vous avez déjà voté dans {votedCount}/{CATEGORIES.length} catégorie{votedCount > 1 ? "s" : ""}.
            Cliquez sur « Voter » à nouveau pour changer un choix.
          </p>
        )}

        <div className="category-tabs reveal" role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeTab === cat.id}
              className={`category-tab${activeTab === cat.id ? " is-active" : ""}`}
              onClick={() => setActiveTab(cat.id)}
            >
              <span className="tab-icon" aria-hidden="true">{cat.icon}</span>
              {cat.title}
              {myVotes[cat.id] && " ✓"}
            </button>
          ))}
        </div>

        <div className="category-panel-header reveal">
          <h3 className="category-panel-title">{activeCategory.title}</h3>
          {results.resultsPublic && <span className="category-panel-total">{activeTotal} votes au total</span>}
        </div>
        <p className="category-panel-desc reveal">{activeCategory.description}</p>

        <div className="nominee-grid reveal">
          {activeCategory.nominees.map((nominee) => {
            const { count, percent } = tallyFor(activeCategory.id, nominee.name);
            const key = `${activeCategory.id}:${nominee.name}`;
            return (
              <NomineeCard
                key={nominee.name}
                nominee={nominee}
                count={count}
                percent={percent}
                resultsPublic={results.resultsPublic}
                isMyVote={myVotes[activeCategory.id] === nominee.name}
                isSubmitting={submittingKey === key}
                onVote={() => handleVote(activeCategory.id, nominee.name)}
              />
            );
          })}
        </div>
      </div>

      {toast && <div className="vote-toast">{toast}</div>}
    </section>
  );
}
