/* =====================================================================
   Empreinte d'appareil (fingerprint) — sans bibliothèque externe.
   Utilisée en complément du cookie posé par le backend : si les cookies
   sont effacés, le serveur reconnaît quand même l'appareil et met à jour
   son vote existant au lieu d'en créer un second.
   ===================================================================== */

function djb2Hash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) hash = (hash * 33) ^ str.charCodeAt(i);
  return (hash >>> 0).toString(36);
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

function collectSignals() {
  const nav = window.navigator;
  return [
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
}

let cachedId = null;

/** Identifiant court et stable pour l'appareil/navigateur courant. */
export function getFingerprint() {
  if (cachedId) return cachedId;
  const raw = collectSignals();
  cachedId = djb2Hash(raw) + "-" + djb2Hash(raw.split("").reverse().join(""));
  return cachedId;
}
