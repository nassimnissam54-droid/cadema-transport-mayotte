/* ═══════════════════════════════════════════════════════════════
   SHARED.JS — utilitaires communs aux 4 pages CADEMA
   Chargé avant cadema.js / les scripts inline des portails.
   ═══════════════════════════════════════════════════════════════ */

// ── Échappement HTML (anti-XSS stocké) ──
// À utiliser sur TOUTE donnée saisie par un utilisateur avant injection via innerHTML.
function esc(v) {
  if (v === null || v === undefined) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Hachage de mot de passe (WebCrypto SHA-256) ──
// Évite le stockage en clair. NB : sans backend + sel unique, reste une mesure
// d'hygiène locale, pas une protection de niveau serveur.
async function hashPassword(plain) {
  try {
    const data = new TextEncoder().encode('cadema::' + plain);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return 'sha256:' + [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Contexte non sécurisé (http://) : repli non chiffré, préfixé pour être reconnaissable
    return 'plain:' + plain;
  }
}
