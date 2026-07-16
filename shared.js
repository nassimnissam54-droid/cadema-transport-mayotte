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

// ── Source unique des lignes Caribus ──
// Utilisée par les 4 pages : plus jamais deux listes divergentes (ex-L1..L8 vs 1N..4).
const CADEMA_LINES = [
  { code: '1N', name: 'Hauts-Vallons → Barge Passot' },
  { code: '1S', name: 'Barge Passot → PEM Passamainty' },
  { code: '2H', name: 'Barge Passot → Hajangoua' },
  { code: '2O', name: 'Barge Passot → Ongojou' },
  { code: '3',  name: 'Doujani Collège → Barge Passot' },
  { code: '4',  name: 'PEM Passamainty → Vahibé' }
];

function lineLabel(code) {
  if (code === 'ALL')  return '🌐 Tous les chauffeurs';
  if (code === 'TEAM') return '👥 Équipe agents';
  const l = CADEMA_LINES.find(x => x.code === code);
  return l ? `Ligne ${l.code} — ${l.name}` : 'Ligne ' + code;
}

// Remplit un <select> avec les lignes officielles.
// opts.extra : [{value,label}] ajoutés en tête (ex: ALL / TEAM).
function populateLineSelect(sel, opts) {
  if (!sel) return;
  const extra = (opts && opts.extra) || [];
  sel.innerHTML =
    extra.map(o => `<option value="${o.value}">${o.label}</option>`).join('') +
    CADEMA_LINES.map(l => `<option value="${l.code}">Ligne ${l.code} — ${l.name}</option>`).join('');
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
