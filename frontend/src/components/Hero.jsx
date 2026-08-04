import { useCountdown } from "../hooks/useCountdown";

const EVENT_DATE = "2026-08-08T18:00:00";

function downloadCalendarInvite() {
  const pad = (n) => String(n).padStart(2, "0");
  const start = new Date(EVENT_DATE);
  const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);
  const fmt = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const stamp = fmt(new Date());

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Maison Baobab//Gala Annuel 2026//FR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:gala-baobab-2026-${stamp}@maison-baobab`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    "SUMMARY:Gala Annuel Maison Baobab — Chic & Glamour",
    "DESCRIPTION:Gala Annuel de la Maison Baobab. Remise des prix et soirée de gala.",
    "LOCATION:Université de Lomé, Togo",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gala-baobab-2026.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function Hero() {
  const cd = useCountdown(EVENT_DATE);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <p className="eyebrow">Maison Baobab — Université de Lomé, Togo</p>
        <h1 className="hero-title">
          Gala&nbsp;Annuel
          <span className="hero-title-accent">Chic&nbsp;&amp;&nbsp;Glamour</span>
        </h1>
        <p className="hero-sub">Samedi 8 Août 2026 · Université de Lomé</p>

        <div className="countdown" role="timer" aria-live="off">
          <div className="cd-unit"><span className="cd-value">{cd.days}</span><span className="cd-label">Jours</span></div>
          <div className="cd-sep">:</div>
          <div className="cd-unit"><span className="cd-value">{cd.hours}</span><span className="cd-label">Heures</span></div>
          <div className="cd-sep">:</div>
          <div className="cd-unit"><span className="cd-value">{cd.minutes}</span><span className="cd-label">Minutes</span></div>
          <div className="cd-sep">:</div>
          <div className="cd-unit"><span className="cd-value">{cd.seconds}</span><span className="cd-label">Secondes</span></div>
        </div>

        <div className="hero-actions">
          <button className="btn-gold btn-large" type="button" onClick={() => scrollTo("vote")}>
            <span>Voter maintenant</span>
          </button>
          <button className="btn-ghost" type="button" onClick={downloadCalendarInvite}>
            <span>📅 Ajouter à mon agenda</span>
          </button>
        </div>
      </div>

      <button className="scroll-cue" type="button" aria-label="Défiler vers le bas" onClick={() => scrollTo("about")}>
        <span className="scroll-cue-line" />
      </button>
    </section>
  );
}
