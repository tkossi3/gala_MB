/* =====================================================================
   Appels vers le backend Spring Boot.
   En dev : Vite proxifie /api vers http://localhost:8080 (voir vite.config.js).
   En prod : le frontend est servi par Spring Boot lui-même (même origine).
   `credentials: "same-origin"` est indispensable : c'est le cookie posé
   par le backend qui identifie l'appareil pour l'anti-doublon.
   ===================================================================== */

import { getFingerprint } from "./fingerprint";

async function apiFetch(path, options = {}) {
  const res = await fetch(path, { credentials: "same-origin", ...options });
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const message = (body && body.error) || `Erreur serveur (${res.status})`;
    throw new Error(message);
  }
  return body;
}

/** Configuration publique : date de l'événement, résultats publics ou non. */
export function fetchConfig() {
  return apiFetch("/api/config");
}

/** Récupère les votes déjà enregistrés pour cet appareil (pré-remplissage). */
export function fetchMyVotes() {
  const fingerprint = encodeURIComponent(getFingerprint());
  return apiFetch(`/api/my-votes?fingerprint=${fingerprint}`);
}

/** Vote (ou met à jour le vote) d'une seule catégorie. */
export function submitVote(categoryId, nominee) {
  return apiFetch("/api/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryId, nominee, fingerprint: getFingerprint() })
  });
}

/** Résultats publics — vides si l'organisateur n'a pas encore ouvert les résultats. */
export function fetchPublicResults() {
  return apiFetch("/api/results");
}

/** --- Zone organisateur (protégée par clé) --- */
export function adminFetchResults(key) {
  return apiFetch(`/api/admin/results?key=${encodeURIComponent(key)}`);
}

export function adminSetResultsPublic(key, resultsPublic) {
  return apiFetch(`/api/admin/settings?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resultsPublic })
  });
}

export function adminExportUrl(key) {
  return `/api/admin/export?key=${encodeURIComponent(key)}`;
}
