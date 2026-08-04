export default function NomineeCard({ nominee, count, percent, resultsPublic, isMyVote, isSubmitting, onVote }) {
  return (
    <div className={`nominee-card${isMyVote ? " is-my-vote" : ""}`}>
      <div className="nominee-photo-wrap">
        <img src={nominee.photo} alt={nominee.name} loading="lazy" />
        {isMyVote && <span className="nominee-my-vote-badge" title="Votre vote actuel">✓</span>}
      </div>
      <div className="nominee-body">
        <p className="nominee-name">{nominee.name}</p>

        {resultsPublic ? (
          <>
            <div className="nominee-stats">
              <span>{count} vote{count === 1 ? "" : "s"}</span>
              <span className="nominee-percent">{percent}%</span>
            </div>
            <div className="nominee-bar-track">
              <div className="nominee-bar-fill" style={{ width: `${percent}%` }} />
            </div>
          </>
        ) : (
          <p className="results-hidden-note">Résultats masqués jusqu'à la soirée du Gala</p>
        )}

        <button
          className={`btn-vote${isMyVote ? " is-active" : ""}`}
          type="button"
          disabled={isSubmitting}
          onClick={onVote}
        >
          {isMyVote ? "✓ Voté" : isSubmitting ? "…" : "Voter"}
        </button>
      </div>
    </div>
  );
}
