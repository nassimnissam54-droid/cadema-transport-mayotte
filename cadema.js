'use strict';
// ═══════════════════════════════════════════════════
//  CADEMA — JS principal
// ═══════════════════════════════════════════════════

// ── Données ──────────────────────────────────────
let incIdCounter = 5;

// ── Lignes CARIBUS réelles (source PDFs officiels) ──
// ══════════════════════════════════════════════════════════════
//  TRACÉS CARIBUS — coordonnées GPS calées sur la carte officielle
//  Référence : caribus.mobilite.yt (carte schématique officielle)
//  Axe RN1 côtier : Barge Passot lng≈45.228, route va SSW (lng diminue légèrement)
//  Les arrêts RESTENT SUR TERRE — côte Est de Mamoudzou à lng≈45.232 max
// ══════════════════════════════════════════════════════════════
const lines = [
  {
    num:'1N', name:'Hauts-Vallons → Barge Passot',
    from:'Hauts-Vallons', to:'Barge Passot', color:'#e11d48',
    freq:10, freqHC:20, freqSam:30, status:'active', ponct:93,
    horaires:{ sem:'05h00–21h00 · Pointe: 10 min · Creuse: 20 min', sam:'06h00–21h00 · 30 min', dim:'08h00–19h00 · 60 min' },
    stopNames:['Hauts-Vallons','Massakini','Collège K2','Cité judiciaire','Trésor public','Barge Passot'],
    // Descente sinueuse depuis les collines NW (Hauts-Vallons) vers Mamoudzou centre
    routeCoords:[
      [-12.7558,45.2048],[-12.7575,45.2065],[-12.7595,45.2082],
      [-12.7618,45.2102],[-12.7632,45.2115],[-12.7648,45.2128],
      [-12.7662,45.2140],[-12.7675,45.2152],[-12.7688,45.2162],
      [-12.7702,45.2172],[-12.7715,45.2182],[-12.7728,45.2192],
      [-12.7740,45.2202],[-12.7750,45.2210],[-12.7760,45.2218],
      [-12.7770,45.2224],[-12.7778,45.2230],[-12.7783,45.2278]
    ]
  },
  {
    num:'1S', name:'Barge Passot → PEM Passamainty',
    from:'Barge Passot', to:'PEM Passamainty', color:'#e11d48',
    freq:10, freqHC:20, freqSam:30, status:'active', ponct:91,
    horaires:{ sem:'05h00–21h00 · Pointe: 10 min · Creuse: 20 min', sam:'06h00–21h00 · 30 min', dim:'08h00–19h00 · 60 min' },
    stopNames:['Barge Passot','Manguier','Baobab — complexe sportif','Halle de pêche','Mairie annexe Harouna Tavanday','Boina Hamissi','Doujani — Écoles','Anratabe','PEM Passamainty'],
    // RN1 axe côtier Sud — la route longe la côte vers SSW (lng diminue légèrement)
    routeCoords:[
      [-12.7793,45.2278],[-12.7800,45.2275],[-12.7808,45.2272],
      [-12.7815,45.2268],[-12.7822,45.2265],[-12.7830,45.2262],
      [-12.7838,45.2258],[-12.7845,45.2255],[-12.7852,45.2252],
      [-12.7860,45.2248],[-12.7868,45.2245],[-12.7875,45.2242],
      [-12.7882,45.2238],[-12.7890,45.2235],[-12.7898,45.2232],
      [-12.7906,45.2228],[-12.7914,45.2225],[-12.7922,45.2222],
      [-12.7930,45.2220],[-12.7938,45.2218],[-12.7946,45.2216],
      [-12.7955,45.2215],[-12.7965,45.2215],[-12.7975,45.2215],
      [-12.7988,45.2215],[-12.8000,45.2215],[-12.8010,45.2215]
    ]
  },
  {
    num:'2H', name:'Barge Passot → Hajangoua',
    from:'Barge Passot', to:'Hajangoua', color:'#16a34a',
    freq:20, freqHC:30, freqSam:30, status:'active', ponct:88,
    horaires:{ sem:'04h30–21h00 · Pointe: 20 min · Creuse: 30 min', sam:'06h00–21h00 · 30 min', dim:'08h00–19h00 · 60 min' },
    stopNames:['Barge Passot','Manguier','Baobab — complexe sportif','Halle de pêche','Mairie annexe Harouna Tavanday','Boina Hamissi','Doujani — Écoles','Anratabe','PEM Passamainty','Tsoundzou 1','Tsoundzou 2','Ironi Bé','Marché Tsararano','Mairie Dembéni','CUFR','Hajangoua'],
    // Axe 1S puis continue S vers Tsoundzou/Tsararano, vire SO vers Dembéni
    routeCoords:[
      [-12.7793,45.2278],[-12.7808,45.2272],[-12.7822,45.2265],
      [-12.7838,45.2258],[-12.7852,45.2252],[-12.7868,45.2245],
      [-12.7882,45.2238],[-12.7898,45.2232],[-12.7914,45.2225],
      [-12.7930,45.2220],[-12.7955,45.2215],[-12.8010,45.2215],
      // Continue Sud → Tsoundzou
      [-12.8025,45.2212],[-12.8040,45.2210],[-12.8055,45.2208],
      [-12.8075,45.2205],[-12.8095,45.2202],[-12.8115,45.2200],
      [-12.8135,45.2198],[-12.8155,45.2195],[-12.8178,45.2192],
      [-12.8198,45.2190],[-12.8218,45.2188],[-12.8238,45.2188],
      [-12.8258,45.2188],
      // Virage SO vers Dembéni
      [-12.8285,45.2182],[-12.8315,45.2172],[-12.8348,45.2158],
      [-12.8382,45.2142],[-12.8415,45.2125],[-12.8448,45.2108],
      [-12.8478,45.2092],[-12.8505,45.2078],[-12.8528,45.2068],
      [-12.8548,45.2060],[-12.8568,45.2052],[-12.8598,45.2042],
      [-12.8628,45.2032],[-12.8658,45.2022],[-12.8688,45.2012]
    ]
  },
  {
    num:'2O', name:'Barge Passot → Ongojou',
    from:'Barge Passot', to:'Ongojou', color:'#16a34a',
    freq:30, freqHC:60, freqSam:30, status:'active', ponct:86,
    horaires:{ sem:'05h00–21h00 · Pointe: 30 min · Creuse: 60 min', sam:'06h00–20h50 · 30 min', dim:'08h00–19h00 · 60 min' },
    stopNames:['Barge Passot','Manguier','Baobab — complexe sportif','Halle de pêche','Mairie annexe Harouna Tavanday','Boina Hamissi','Doujani — Écoles','Anratabe','PEM Passamainty','Tsoundzou 1','Tsoundzou 2','Ironi Bé','Marché Tsararano','Tsararano Village','Ongojou'],
    // Identique 2H jusqu'à Tsararano, puis bifurcation plein Ouest vers Ongojou
    routeCoords:[
      [-12.7793,45.2278],[-12.7808,45.2272],[-12.7822,45.2265],
      [-12.7838,45.2258],[-12.7852,45.2252],[-12.7868,45.2245],
      [-12.7882,45.2238],[-12.7898,45.2232],[-12.7914,45.2225],
      [-12.7930,45.2220],[-12.7955,45.2215],[-12.8010,45.2215],
      [-12.8040,45.2210],[-12.8075,45.2205],[-12.8115,45.2200],
      [-12.8155,45.2195],[-12.8198,45.2190],[-12.8238,45.2188],
      [-12.8258,45.2188],
      // Bifurcation Ouest vers Ongojou (route secondaire)
      [-12.8272,45.2175],[-12.8285,45.2155],[-12.8298,45.2130],
      [-12.8312,45.2105],[-12.8325,45.2078],[-12.8340,45.2052],
      [-12.8358,45.2028]
    ]
  },
  {
    num:'3', name:'Doujani Collège → Barge Passot',
    from:'Doujani — Collège', to:'Barge Passot', color:'#ea580c',
    freq:10, freqHC:20, freqSam:30, status:'active', ponct:90,
    horaires:{ sem:'05h00–21h00 · Pointe: 10 min · Creuse: 20 min', sam:'06h00–21h00 · 30 min', dim:'08h00–19h00 · 60 min' },
    stopNames:['Doujani — Collège','Doujani — Mosquée',"M'tsapéré",'Dispensaire','Belvédère','École primaire','Briqueterie','Tamarins','Tribunal Administratif','Hôpital de Mayotte','Jacaranda','Barge Passot'],
    // Ligne 3 : hauts de Mamoudzou (Doujani/M'tsapéré à l'Ouest) → descente vers centre
    routeCoords:[
      [-12.8000,45.2125],[-12.7990,45.2132],[-12.7980,45.2140],
      [-12.7968,45.2148],[-12.7958,45.2152],[-12.7950,45.2148],
      [-12.7938,45.2142],[-12.7925,45.2138],[-12.7912,45.2138],
      [-12.7900,45.2140],[-12.7888,45.2142],[-12.7876,45.2148],
      [-12.7865,45.2155],[-12.7855,45.2162],[-12.7845,45.2170],
      [-12.7835,45.2178],[-12.7825,45.2188],[-12.7818,45.2198],
      [-12.7812,45.2208],[-12.7808,45.2218],[-12.7805,45.2228],
      [-12.7802,45.2242],[-12.7800,45.2255],[-12.7796,45.2265],
      [-12.7793,45.2278]
    ]
  },
  {
    num:'4', name:'PEM Passamainty → Vahibé',
    from:'PEM Passamainty', to:'Vahibé Chendra', color:'#2563eb',
    freq:10, freqHC:30, freqSam:30, status:'active', ponct:94,
    horaires:{ sem:'04h30–21h00 · Pointe: 10 min · Creuse: 30 min', sam:'06h00–21h00 · 30 min', dim:'08h00–19h00 · 60 min' },
    stopNames:['PEM Passamainty','Stade de Cavani','Collège de Kawéni','Vahibé Mariage','Vahibé Chendra'],
    // Ligne 4 : de PEM Passamainty remonte vers Nord (Mamoudzou → Kawéni → Vahibé)
    // RN1 côté Nord — Kawéni et Vahibé sont au NORD de Mamoudzou
    routeCoords:[
      [-12.8010,45.2215],[-12.7998,45.2218],[-12.7985,45.2220],
      [-12.7970,45.2222],[-12.7955,45.2225],[-12.7940,45.2228],
      [-12.7922,45.2230],[-12.7905,45.2232],[-12.7888,45.2235],
      // Stade Cavani (Mamoudzou centre)
      [-12.7870,45.2238],[-12.7852,45.2240],[-12.7835,45.2242],
      [-12.7818,45.2245],[-12.7800,45.2248],[-12.7783,45.2250],
      // Vers Kawéni (Nord)
      [-12.7765,45.2252],[-12.7748,45.2252],[-12.7730,45.2250],
      [-12.7712,45.2248],[-12.7695,45.2245],[-12.7678,45.2242],
      // Kawéni
      [-12.7660,45.2238],[-12.7645,45.2235],[-12.7628,45.2232],
      // Vers Vahibé
      [-12.7610,45.2228],[-12.7592,45.2225],[-12.7575,45.2222],
      [-12.7558,45.2220],[-12.7540,45.2218],[-12.7522,45.2215],
      [-12.7505,45.2212]
    ]
  },
];

const incidents = [
  { id:'INC-001', date:'2026-06-28', time:'07:42', line:'2H', desc:'Retard important — accident sur la RN1 à Dembéni, entre Ironi Bé et Mairie Dembéni', severity:'high',   status:'open' },
  { id:'INC-002', date:'2026-06-28', time:'09:15', line:'2O', desc:'Suspension temporaire — route impraticable entre Tsararano Village et Ongojou', severity:'high',   status:'open' },
  { id:'INC-003', date:'2026-06-28', time:'11:03', line:'1N', desc:'Panne mécanique bus n°14 entre Massakini et Collège K2 — remplacement en cours', severity:'medium', status:'open' },
  { id:'INC-004', date:'2026-06-27', time:'14:30', line:'3',  desc:'Retard 15 min — manifestation à M\'tsapéré, arrêt décalé',  severity:'low',    status:'resolved' },
  { id:'INC-005', date:'2026-06-27', time:'08:00', line:'4',  desc:'Arrêt Vahibé Mariage fermé temporairement — travaux de voirie', severity:'medium', status:'resolved' },
];

// ── Compte (localStorage) ────────────────────────
function loadCompte() {
  try { return JSON.parse(localStorage.getItem('cadema_compte') || 'null') || defaultCompte(); }
  catch { return defaultCompte(); }
}
function defaultCompte() {
  return {
    nom:'Agent Réseau', email:'agent@cadema-mayotte.fr', role:'Opérateur',
    titres:[
      { id:1, type:'mensuel', num:'MAY-2026-0041', expiry:'2026-07-31' },
      { id:2, type:'carnet',  num:'MAY-2026-0099', expiry:'2026-12-31' },
    ],
    lieux:[
      { id:1, type:'home', nom:'Domicile',      adresse:'Arrêt Hauts-Vallons' },
      { id:2, type:'work', nom:'Bureau CADEMA', adresse:'Arrêt Barge Passot' },
    ],
    trajets:[
      { id:1, nom:'Domicile → Travail', from:'Hauts-Vallons', to:'Barge Passot', line:'1N', heure:'07:00', jours:['Lun','Mar','Mer','Jeu','Ven'] },
      { id:2, nom:'Travail → Domicile', from:'Barge Passot',  to:'Hauts-Vallons', line:'1N', heure:'17:30', jours:['Lun','Mar','Mer','Jeu','Ven'] },
    ],
    historique:[
      { date:'2026-06-28', heure:'07:02', line:'1N', from:'Hauts-Vallons',   to:'Barge Passot',    duree:'14 min', titre:'Abonnement mensuel' },
      { date:'2026-06-27', heure:'17:32', line:'1N', from:'Barge Passot',    to:'Hauts-Vallons',   duree:'16 min', titre:'Abonnement mensuel' },
      { date:'2026-06-27', heure:'07:00', line:'1N', from:'Hauts-Vallons',   to:'Barge Passot',    duree:'13 min', titre:'Abonnement mensuel' },
      { date:'2026-06-26', heure:'17:35', line:'1N', from:'Barge Passot',    to:'Hauts-Vallons',   duree:'15 min', titre:'Abonnement mensuel' },
      { date:'2026-06-25', heure:'09:10', line:'1S', from:'Barge Passot',    to:'PEM Passamainty', duree:'22 min', titre:'Abonnement mensuel' },
      { date:'2026-06-24', heure:'14:20', line:'3',  from:'Doujani — Collège', to:'Barge Passot',  duree:'28 min', titre:'Carnet 10 voyages'  },
    ],
  };
}
function saveCompte() { localStorage.setItem('cadema_compte', JSON.stringify(compte)); }
let compte = loadCompte();
let titreIdCtr  = Math.max(0, ...compte.titres.map(t=>t.id));
let lieuIdCtr   = Math.max(0, ...compte.lieux.map(l=>l.id));
let trajetIdCtr = Math.max(0, ...compte.trajets.map(t=>t.id));

// ── Toast ─────────────────────────────────────────
function toast(msg, type='success') {
  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => { el.classList.add('toast-out'); el.addEventListener('animationend', ()=>el.remove()); }, 3000);
}
function showToast(msg, type='success', icon) {
  toast(icon ? `${icon} ${msg}` : msg, type);
}

// ── PWA : service worker (mode hors-ligne) ────────
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// ── Clock ─────────────────────────────────────────
function updateClock() {
  const el = document.getElementById('live-clock');
  if (el) el.textContent = new Date().toLocaleTimeString('fr-FR');
}
setInterval(updateClock, 1000);
updateClock();

// ── Newsletter ────────────────────────────────────
function subscribeNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  const btn   = e.target.querySelector('button');
  btn.textContent = '✓ Inscrit !';
  btn.style.background = '#059669';
  input.value = '';
  input.disabled = true;
  setTimeout(() => {
    btn.textContent = "S'abonner";
    btn.style.background = '';
    input.disabled = false;
  }, 4000);
}

// ── Dark mode ─────────────────────────────────────
function toggleDark() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('dark-btn').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('cadema_theme', isDark ? 'light' : 'dark');
  updateDrawerDarkBtn();
}
(function initTheme() {
  const saved = localStorage.getItem('cadema_theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme','dark');
    const btn = document.getElementById('dark-btn');
    if (btn) btn.textContent = '☀️';
  }
})();

// ── Scroll effects ────────────────────────────────
window.addEventListener('scroll', () => {
  const header = document.getElementById('main-header');
  const btt    = document.getElementById('back-to-top');
  if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  if (btt)    btt.classList.toggle('visible', window.scrollY > 400);
}, { passive:true });

// ── Navigation ────────────────────────────────────
let chartsRendered = false;
let statsAnimated  = false;

function showSection(id, navEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  const target = document.getElementById('section-' + id);
  if (target) target.classList.add('active');
  if (navEl)  navEl.classList.add('active');
  document.getElementById('main-nav').classList.remove('open');
  document.getElementById('burger-btn').classList.remove('open');
  syncDrawerActive(id);
  syncBottomNav(id);
  window.scrollTo({ top:0, behavior:'smooth' });
  if (id === 'stats' && !chartsRendered) { chartsRendered = true; renderCharts(); }
  if (id === 'stats' && !statsAnimated)  { statsAnimated  = true; animateStats(); }
}

function toggleNav() {
  document.getElementById('main-nav').classList.toggle('open');
  document.getElementById('burger-btn').classList.toggle('open');
}

// ── Side Drawer ───────────────────────────────────
function openDrawer() {
  document.getElementById('side-drawer').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('burger-btn').classList.add('open');
  document.getElementById('side-drawer').setAttribute('aria-hidden','false');
  updateDrawerData();
}
function closeDrawer() {
  document.getElementById('side-drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
  document.getElementById('burger-btn').classList.remove('open');
  document.getElementById('side-drawer').setAttribute('aria-hidden','true');
}
function updateDrawerData() {
  const openCnt = incidents.filter(i => i.status === 'open').length;
  const badge = document.getElementById('drawer-inc-badge');
  const count = document.getElementById('drawer-inc-count');
  const statusTxt = document.getElementById('drawer-status-text');
  if (badge) badge.textContent = openCnt + ' incident' + (openCnt > 1 ? 's' : '');
  if (count) count.textContent = openCnt;
  if (statusTxt) statusTxt.textContent = openCnt > 0 ? openCnt + ' perturbation(s)' : 'Réseau opérationnel';
  const nameEl = document.getElementById('drawer-full-name');
  const roleEl = document.getElementById('drawer-role');
  const avatarEl = document.getElementById('drawer-avatar');
  const subEl = document.getElementById('drawer-user-name');
  if (nameEl) nameEl.textContent = compte.nom || 'Agent Réseau';
  if (roleEl) roleEl.textContent = compte.role || 'Opérateur CADEMA';
  if (avatarEl) avatarEl.textContent = (compte.nom || 'AR').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  if (subEl) subEl.textContent = compte.nom || 'Agent Réseau';
}
// Sync drawer active item with current section
function syncDrawerActive(id) {
  document.querySelectorAll('.drawer-item[id^="ditem-"]').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('ditem-' + id);
  if (target) target.classList.add('active');
}
// Drawer clock (synced with main clock)
setInterval(() => {
  const el = document.getElementById('drawer-clock');
  if (el) el.textContent = new Date().toLocaleTimeString('fr-FR');
}, 1000);
// Dark mode button label in drawer
function updateDrawerDarkBtn() {
  const btn = document.getElementById('drawer-dark-btn');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.innerHTML = isDark ? '☀️ Mode clair' : '🌙 Mode sombre';
}
// Close drawer on Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

// ── Bottom nav sync ───────────────────────────────
const BN_MAP = { home:'bn-home', lignes:'bn-lignes', tarifs:'bn-tarifs', compte:'bn-compte' };
function syncBottomNav(id) {
  document.querySelectorAll('.bn-item').forEach(el => el.classList.remove('active'));
  const target = BN_MAP[id] ? document.getElementById(BN_MAP[id]) : null;
  if (target) target.classList.add('active');
}

// ── Pills ─────────────────────────────────────────
function statusPill(s) {
  const map = { active:['pill-green','Actif'], delayed:['pill-orange','Retard'], suspended:['pill-gray','Suspendu'] };
  const [cls, label] = map[s] || ['pill-gray', s||'—'];
  return `<span class="pill ${cls}">${label}</span>`;
}
function severityPill(s) {
  const map = { high:['pill-red','Élevée'], medium:['pill-orange','Moyenne'], low:['pill-green','Faible'] };
  const [cls, label] = map[s] || ['pill-gray', s];
  return `<span class="pill ${cls}">${label}</span>`;
}
function incStatusPill(s) {
  return s==='open' ? `<span class="pill pill-orange">En cours</span>` : `<span class="pill pill-green">Résolu</span>`;
}

// ── Hero status card (TFL style) ──────────────────
function renderHeroStatus() {
  const el = document.getElementById('hero-status-lines');
  if (!el) return;
  el.innerHTML = lines.slice(0,6).map(l => `
    <div class="status-line-row">
      <div class="status-line-num">${l.num}</div>
      <div class="status-line-info">
        <div class="status-line-name">${l.name.split('—')[1]?.trim() || l.to}</div>
      </div>
      <div class="status-dot ${l.status}"></div>
    </div>`).join('');
}

// ── TFL Status board ─────────────────────────────
function renderStatusBoard() {
  const el = document.getElementById('status-board');
  if (!el) return;
  const fillPct = { active:100, delayed:45, suspended:0 };
  el.innerHTML = lines.map(l => `
    <div class="status-board-row">
      <div class="sb-num ${l.status !== 'active' ? l.status : ''}">${l.num}</div>
      <div style="flex:1">
        <div class="sb-name">${l.name}</div>
        <div class="sb-route">${l.from} → ${l.to}</div>
      </div>
      <div class="sb-freq">Toutes les ${l.freq} min</div>
      <div class="sb-status-bar">
        <div class="sb-status-fill fill-${l.status}" style="width:${fillPct[l.status]||0}%"></div>
      </div>
      ${statusPill(l.status)}
    </div>`).join('');
}

// ── Info trafic ticker ────────────────────────────
function renderTicker() {
  const open = incidents.filter(i => i.status === 'open');
  const el   = document.getElementById('trafic-ticker');
  if (!el) return;
  el.textContent = open.length
    ? open.map(i => `[${i.line}] ${i.desc}`).join('   ·   ')
    : 'Aucune perturbation en cours sur le réseau.';
}

// ── Hero KPIs (animated counters) ────────────────
function animateCounter(el, target, duration=1200) {
  const start = performance.now();
  const step  = ts => {
    const p = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target).toLocaleString('fr-FR');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function updateHeroKPIs() {
  const openCnt   = incidents.filter(i => i.status === 'open').length;
  const activeCnt = lines.filter(l => l.status === 'active').length;
  const incEl  = document.getElementById('hkpi-incidents');
  const lineEl = document.getElementById('hkpi-lines');
  const badge  = document.getElementById('nav-inc-count');
  if (incEl)  { incEl.dataset.target  = openCnt;   incEl.textContent  = openCnt; }
  if (lineEl) { lineEl.dataset.target = activeCnt; lineEl.textContent = activeCnt; }
  if (badge)  badge.textContent = openCnt;
}

// Run counters when home is first visible
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    document.querySelectorAll('.hero-kpi strong[data-target]').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target) || 0);
    });
    heroObserver.disconnect();
  });
}, { threshold:.3 });

// ══════════════════════════════════════════════════
//  PLANIFICATEUR D'ITINÉRAIRE — Autocomplete + Carte
// ══════════════════════════════════════════════════

// ── Arrêts CARIBUS Mayotte — coordonnées calées sur routeCoords ──
// IMPORTANT : tous les arrêts sont sur terre ferme (lng ≤ 45.230 côte Est Mamoudzou)
// Axe Sud (1S/2H/2O) : RN1 longe côte SSW → lng diminue de 45.228 à 45.215
// Axe Nord (Ligne 4) : RN1 monte vers Kawéni/Vahibé → lng ≈ 45.221 à 45.228
const stops = [
  // ── LIGNE 1N — collines NW → Mamoudzou centre ──
  { name:'Hauts-Vallons',                  lat:-12.7558, lng:45.2048, lines:['1N'],                    icon:'🏘️' },
  { name:'Massakini',                      lat:-12.7632, lng:45.2115, lines:['1N'],                    icon:'🚏' },
  { name:'Collège K2',                     lat:-12.7688, lng:45.2162, lines:['1N'],                    icon:'🎓' },
  { name:'Cité judiciaire',               lat:-12.7740, lng:45.2202, lines:['1N'],                    icon:'⚖️' },
  { name:'Trésor public',                  lat:-12.7778, lng:45.2230, lines:['1N'],                    icon:'🏛️' },
  { name:'Barge Passot',                   lat:-12.7793, lng:45.2278, lines:['1N','1S','2H','2O','3'],  icon:'⛴️' },

  // ── LIGNES 1S/2H/2O — RN1 axe côtier Sud (route longe côte SSW, lng ↘) ──
  { name:'Manguier',                       lat:-12.7815, lng:45.2268, lines:['1S','2H','2O'],          icon:'🚏' },
  { name:'Baobab — complexe sportif',      lat:-12.7838, lng:45.2258, lines:['1S','2H','2O'],          icon:'🏟️' },
  { name:'Halle de pêche',                 lat:-12.7860, lng:45.2248, lines:['1S','2H','2O'],          icon:'🐟' },
  { name:'Mairie annexe Harouna Tavanday', lat:-12.7882, lng:45.2238, lines:['1S','2H','2O'],          icon:'🏛️' },
  { name:'Boina Hamissi',                  lat:-12.7906, lng:45.2228, lines:['1S','2H','2O'],          icon:'🚏' },
  { name:'Doujani — Écoles',              lat:-12.7922, lng:45.2222, lines:['1S','2H','2O'],          icon:'🏫' },
  { name:'Anratabe',                       lat:-12.7946, lng:45.2216, lines:['1S','2H','2O'],          icon:'🚏' },
  { name:'PEM Passamainty',                lat:-12.8010, lng:45.2215, lines:['1S','2H','2O','4'],      icon:'🚉' },

  // ── 2H/2O — suite RN1 Sud vers Tsoundzou/Tsararano ──
  { name:'Tsoundzou 1',                    lat:-12.8055, lng:45.2208, lines:['2H','2O'],               icon:'🚏' },
  { name:'Tsoundzou 2',                    lat:-12.8115, lng:45.2200, lines:['2H','2O'],               icon:'🚏' },
  { name:'Ironi Bé',                       lat:-12.8178, lng:45.2192, lines:['2H','2O'],               icon:'🚏' },
  { name:'Marché Tsararano',               lat:-12.8238, lng:45.2188, lines:['2H','2O'],               icon:'🏪' },

  // ── LIGNE 2H — continue SO vers Dembéni/Hajangoua ──
  { name:'Mairie Dembéni',                 lat:-12.8478, lng:45.2092, lines:['2H'],                    icon:'🏛️' },
  { name:'CUFR',                           lat:-12.8548, lng:45.2060, lines:['2H'],                    icon:'🎓' },
  { name:'Hajangoua',                      lat:-12.8688, lng:45.2012, lines:['2H'],                    icon:'🏘️' },

  // ── LIGNE 2O — bifurcation Ouest vers Ongojou ──
  { name:'Tsararano Village',              lat:-12.8285, lng:45.2155, lines:['2O'],                    icon:'🚏' },
  { name:'Ongojou',                        lat:-12.8358, lng:45.2028, lines:['2O'],                    icon:'🏘️' },

  // ── LIGNE 3 — Doujani/M'tsapéré (Ouest) → Barge Passot ──
  { name:'Doujani — Collège',             lat:-12.8000, lng:45.2125, lines:['3'],                     icon:'🎓' },
  { name:'Doujani — Mosquée',             lat:-12.7980, lng:45.2140, lines:['3'],                     icon:'🕌' },
  { name:"M'tsapéré",                      lat:-12.7950, lng:45.2148, lines:['3'],                     icon:'🚏' },
  { name:'Dispensaire',                    lat:-12.7925, lng:45.2138, lines:['3'],                     icon:'🏥' },
  { name:'Belvédère',                      lat:-12.7900, lng:45.2140, lines:['3'],                     icon:'🚏' },
  { name:'École primaire',                 lat:-12.7876, lng:45.2148, lines:['3'],                     icon:'🏫' },
  { name:'Briqueterie',                    lat:-12.7855, lng:45.2162, lines:['3'],                     icon:'🚏' },
  { name:'Tamarins',                       lat:-12.7835, lng:45.2178, lines:['3'],                     icon:'🌳' },
  { name:'Tribunal Administratif',         lat:-12.7818, lng:45.2198, lines:['3'],                     icon:'⚖️' },
  { name:'Hôpital de Mayotte',            lat:-12.7808, lng:45.2218, lines:['3'],                     icon:'🏥' },
  { name:'Jacaranda',                      lat:-12.7800, lng:45.2255, lines:['3'],                     icon:'🌸' },

  // ── LIGNE 4 — PEM Passamainty → Nord (Stade Cavani → Kawéni → Vahibé) ──
  { name:'Stade de Cavani',                lat:-12.7888, lng:45.2235, lines:['4'],                     icon:'🏟️' },
  { name:'Collège de Kawéni',             lat:-12.7660, lng:45.2238, lines:['4'],                     icon:'🎓' },
  { name:'Vahibé Mariage',                 lat:-12.7575, lng:45.2222, lines:['4'],                     icon:'🚏' },
  { name:'Vahibé Chendra',                 lat:-12.7505, lng:45.2212, lines:['4'],                     icon:'🏘️' },
];

// Index rapide nom → objet stop
const stopByName = Object.fromEntries(stops.map(s => [s.name.toLowerCase(), s]));

// Indice de focus pour navigation clavier
let itinFocusIdx = { from: -1, to: -1 };

function itinAutocomplete(side, val) {
  const box = document.getElementById(`suggestions-${side}`);
  const clearBtn = document.getElementById(`clear-${side}`);
  if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';
  itinFocusIdx[side] = -1;

  if (!val.trim()) { box.classList.remove('open'); return; }
  const q = val.toLowerCase();
  const hits = stops.filter(s => s.name.toLowerCase().includes(q)).slice(0, 7);
  if (!hits.length) { box.classList.remove('open'); return; }

  box.innerHTML = hits.map((s, i) => `
    <div class="itin-suggestion-item" data-idx="${i}"
      onmousedown="selectItinStop('${side}','${s.name.replace(/'/g,"\\'")}')">
      <div class="sug-icon">${s.icon}</div>
      <span class="sug-name">${highlight(s.name, val)}</span>
      ${s.lines.length ? `<span class="sug-line">${s.lines.slice(0,2).join(' · ')}</span>` : ''}
    </div>`).join('');
  box.classList.add('open');
}

function highlight(text, query) {
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
  return text.replace(re, '<strong>$1</strong>');
}

function selectItinStop(side, name) {
  document.getElementById(`itin-${side}`).value = name;
  document.getElementById(`suggestions-${side}`).classList.remove('open');
  const clearBtn = document.getElementById(`clear-${side}`);
  if (clearBtn) clearBtn.style.display = 'flex';
  itinFocusIdx[side] = -1;
}

function clearItin(side) {
  document.getElementById(`itin-${side}`).value = '';
  document.getElementById(`suggestions-${side}`).classList.remove('open');
  document.getElementById(`clear-${side}`).style.display = 'none';
  document.getElementById(`itin-${side}`).focus();
}

function itinKey(e, side) {
  const box = document.getElementById(`suggestions-${side}`);
  const items = box.querySelectorAll('.itin-suggestion-item');
  if (!items.length) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    itinFocusIdx[side] = Math.min(itinFocusIdx[side]+1, items.length-1);
    items.forEach((el,i) => el.classList.toggle('focused', i===itinFocusIdx[side]));
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    itinFocusIdx[side] = Math.max(itinFocusIdx[side]-1, 0);
    items.forEach((el,i) => el.classList.toggle('focused', i===itinFocusIdx[side]));
  } else if (e.key === 'Enter') {
    if (itinFocusIdx[side] >= 0 && items[itinFocusIdx[side]]) {
      items[itinFocusIdx[side]].dispatchEvent(new MouseEvent('mousedown'));
    } else {
      searchItinerary();
    }
  } else if (e.key === 'Escape') {
    box.classList.remove('open');
  }
}

function swapItinerary() {
  const from = document.getElementById('itin-from');
  const to   = document.getElementById('itin-to');
  [from.value, to.value] = [to.value, from.value];
  ['from','to'].forEach(s => {
    const cb = document.getElementById(`clear-${s}`);
    if (cb) cb.style.display = document.getElementById(`itin-${s}`).value ? 'flex' : 'none';
  });
}

// Haversine distance (km)
function haversine(a, b) {
  const R = 6371, dLat = (b.lat-a.lat)*Math.PI/180, dLng = (b.lng-a.lng)*Math.PI/180;
  const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}

function fmt(min) {
  if (min < 60) return `${Math.round(min)} min`;
  return `${Math.floor(min/60)}h${String(Math.round(min%60)).padStart(2,'0')}`;
}

// Carte Leaflet
let itinMap = null;
let itinLayers = [];

function initItinMap() {
  if (itinMap) return;
  itinMap = L.map('itin-map', { zoomControl: true, attributionControl: true })
    .setView([-12.83, 45.15], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(itinMap);
}

function clearMapLayers() {
  itinLayers.forEach(l => l.remove());
  itinLayers = [];
}

function makeIcon(html, size=36) {
  return L.divIcon({ html, className: '', iconSize:[size,size], iconAnchor:[size/2,size/2] });
}

let currentMode = 'bus';

function selectMode(mode) {
  currentMode = mode;
  ['bus','bike','walk'].forEach(m => {
    document.getElementById(`mode-${m}`).classList.toggle('active', m===mode);
  });
}

function findStop(val) {
  const q = val.toLowerCase().trim();
  return stops.find(s => s.name.toLowerCase() === q)
      || stops.find(s => s.name.toLowerCase().includes(q));
}

function searchItinerary() {
  const fromVal = document.getElementById('itin-from').value.trim();
  const toVal   = document.getElementById('itin-to').value.trim();

  if (!fromVal || !toVal) {
    showToast('Veuillez renseigner le départ et la destination.', 'warning', '📍');
    return;
  }

  const fromStop = findStop(fromVal);
  const toStop   = findStop(toVal);

  if (!fromStop || !toStop) {
    showToast('Arrêt non trouvé. Choisissez dans les suggestions.', 'warning', '🔍');
    return;
  }
  if (fromStop.name === toStop.name) {
    showToast('Le départ et la destination sont identiques.', 'warning', '📍');
    return;
  }

  // Chercher la meilleure ligne Caribus (stopNames ordonnés)
  const matchedLine = lines.find(l => {
    const sn = l.stopNames.map(n => n.toLowerCase());
    const fi = sn.findIndex(n => n === fromStop.name.toLowerCase() || fromStop.name.toLowerCase().includes(n) || n.includes(fromStop.name.toLowerCase()));
    const ti = sn.findIndex(n => n === toStop.name.toLowerCase() || toStop.name.toLowerCase().includes(n) || n.includes(toStop.name.toLowerCase()));
    return fi !== -1 && ti !== -1;
  }) || lines.find(l =>
    fromStop.lines.includes(l.num) || toStop.lines.includes(l.num)
  );

  const routeStops = buildRoute(fromStop, toStop, matchedLine);

  // Calcul des temps selon distance réelle
  const dist     = haversine(fromStop, toStop);
  const nbStops  = routeStops.length - 1;
  const busMins  = Math.round(nbStops * 2.5 + dist / 20 * 60);  // ~2.5 min/arrêt + vitesse
  const bikeMins = Math.round(dist / 14 * 60);
  const walkMins = Math.round(dist / 4.5 * 60);

  document.getElementById('res-from').textContent  = fromStop.name;
  document.getElementById('res-to').textContent    = toStop.name;
  document.getElementById('time-bus').textContent  = fmt(busMins);
  document.getElementById('time-bike').textContent = `~${fmt(bikeMins)}`;
  document.getElementById('time-walk').textContent = fmt(walkMins);

  const walkIn  = estimateWalkToStop(fromStop, 'in');
  const walkOut = estimateWalkToStop(toStop, 'out');

  selectMode('bus');
  renderTripDetail(fromStop, toStop, routeStops, matchedLine, busMins, walkIn, walkOut);
  showItinResult();

  // Partage + favoris + countdown temps réel
  lastItin = { from: fromStop.name, to: toStop.name };
  history.replaceState(null, '', `${location.pathname}?de=${encodeURIComponent(fromStop.name)}&vers=${encodeURIComponent(toStop.name)}`);
  updateFavBtn();
  startNextPassCountdown(matchedLine);

  // Reset l'alerte de descente sur une nouvelle recherche
  stopStopAlert();
  currentItinDestStop = toStop;
  const alertBtn = document.getElementById('stop-alert-btn');
  if (alertBtn) alertBtn.classList.remove('active');
  const alertLabel = document.getElementById('stop-alert-label');
  if (alertLabel) alertLabel.textContent = "Activer l'alerte de descente";

  setTimeout(() => {
    initItinMap();
    clearMapLayers();
    renderItinMap(fromStop, toStop, routeStops, matchedLine, walkIn, walkOut);
  }, 120);
}

// ── Partage d'itinéraire (URL avec paramètres) ────
let lastItin = null; // { from, to } de la dernière recherche

function shareItinerary() {
  if (!lastItin) return;
  const url = `${location.origin}${location.pathname}?de=${encodeURIComponent(lastItin.from)}&vers=${encodeURIComponent(lastItin.to)}`;
  if (navigator.share) {
    navigator.share({ title: 'Itinéraire Caribus — CADEMA', text: `${lastItin.from} → ${lastItin.to}`, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(
      () => showToast('Lien copié ! Partagez-le à qui vous voulez.', 'success', '🔗'),
      () => showToast('Impossible de copier le lien.', 'error', '⚠️')
    );
  }
}

// Au chargement : si ?de=X&vers=Y dans l'URL, lance la recherche automatiquement
window.addEventListener('DOMContentLoaded', () => {
  const p = new URLSearchParams(location.search);
  const de = p.get('de'), vers = p.get('vers');
  if (de && vers) {
    document.getElementById('itin-from').value = de;
    document.getElementById('itin-to').value = vers;
    setTimeout(() => searchItinerary(), 400);
  }
  renderFavChips();
});

// ── Itinéraires favoris (localStorage) ────────────
function getFavRoutes() {
  try { return JSON.parse(localStorage.getItem('cadema_favs') || '[]'); }
  catch { return []; }
}
function isFavRoute(from, to) {
  return getFavRoutes().some(f => f.from === from && f.to === to);
}
function toggleFavRoute() {
  if (!lastItin) return;
  let favs = getFavRoutes();
  if (isFavRoute(lastItin.from, lastItin.to)) {
    favs = favs.filter(f => !(f.from === lastItin.from && f.to === lastItin.to));
    showToast('Itinéraire retiré des favoris.', 'info', '☆');
  } else {
    favs.unshift({ from: lastItin.from, to: lastItin.to });
    favs = favs.slice(0, 5); // max 5 favoris
    showToast('Itinéraire ajouté aux favoris !', 'success', '⭐');
  }
  localStorage.setItem('cadema_favs', JSON.stringify(favs));
  updateFavBtn();
  renderFavChips();
}
function updateFavBtn() {
  const btn = document.getElementById('fav-route-btn');
  if (!btn || !lastItin) return;
  const fav = isFavRoute(lastItin.from, lastItin.to);
  btn.textContent = fav ? '⭐' : '☆';
  btn.classList.toggle('active', fav);
}
function renderFavChips() {
  const box = document.getElementById('itin-favs');
  if (!box) return;
  const favs = getFavRoutes();
  box.innerHTML = favs.length
    ? favs.map(f => `
      <button class="fav-chip" onclick="loadFavRoute('${f.from.replace(/'/g,"\\'")}','${f.to.replace(/'/g,"\\'")}')">
        ⭐ ${f.from} → ${f.to}
      </button>`).join('')
    : '';
}
function loadFavRoute(from, to) {
  document.getElementById('itin-from').value = from;
  document.getElementById('itin-to').value = to;
  searchItinerary();
}

// ── Prochain passage (temps réel simulé) ──────────
let nextPassTimer = null;

function parseFrequency(line) {
  // "05h00–21h00 · Pointe: 10 min · Creuse: 20 min"
  const sem = line && line.horaires ? line.horaires.sem : '';
  const pointe = (sem.match(/Pointe\s*:\s*(\d+)/i) || [])[1];
  const creuse = (sem.match(/Creuse\s*:\s*(\d+)/i) || [])[1];
  const single = (sem.match(/(\d+)\s*min/i) || [])[1];
  return {
    pointe: parseInt(pointe || single || 15, 10),
    creuse: parseInt(creuse || single || 25, 10)
  };
}

function nextPassageMins(line) {
  const now = new Date();
  const h = now.getHours();
  if (h < 5 || h >= 21) return null; // service fermé
  const freq = parseFrequency(line);
  const isPointe = (h >= 6 && h < 9) || (h >= 15 && h < 18);
  const f = isPointe ? freq.pointe : freq.creuse;
  const minsSinceHour = now.getMinutes() + now.getSeconds() / 60;
  return Math.max(1, Math.ceil(f - (minsSinceHour % f)));
}

function startNextPassCountdown(line) {
  if (nextPassTimer) { clearInterval(nextPassTimer); nextPassTimer = null; }
  const update = () => {
    const el = document.getElementById('next-pass-live');
    if (!el) return;
    const mins = nextPassageMins(line);
    el.innerHTML = mins === null
      ? '🌙 Service terminé — reprise à 05h00'
      : `<span class="next-pass-dot"></span>Prochain passage estimé dans <strong>${mins} min</strong>`;
  };
  update();
  nextPassTimer = setInterval(update, 30000);
}

// ── Alerte de descente (vibration à l'approche de l'arrêt) ──
let currentItinDestStop = null;
let stopAlertWatchId    = null;
const STOP_ALERT_RADIUS_M = 250; // déclenche la vibration sous ce seuil

function toggleStopAlert() {
  if (stopAlertWatchId !== null) { stopStopAlert(true); return; }

  if (!currentItinDestStop) {
    showToast('Recherchez d\'abord un itinéraire.', 'warning', '📍');
    return;
  }
  if (!('geolocation' in navigator)) {
    showToast('La géolocalisation n\'est pas disponible sur cet appareil.', 'warning', '⚠️');
    return;
  }

  const btn   = document.getElementById('stop-alert-btn');
  const label = document.getElementById('stop-alert-label');
  btn.classList.add('active');
  label.textContent = 'Alerte active — suivi de votre position…';
  showToast(`Vous serez alerté(e) à l'approche de ${currentItinDestStop.name}.`, 'success', '🔔');

  stopAlertWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      const userPt = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const distM  = haversine(userPt, currentItinDestStop) * 1000;
      if (distM <= STOP_ALERT_RADIUS_M) {
        triggerStopAlert();
      }
    },
    () => {
      showToast('Impossible d\'accéder à votre position. Vérifiez les autorisations.', 'warning', '📍');
      stopStopAlert();
    },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
  );
}

function triggerStopAlert() {
  if ('vibrate' in navigator) navigator.vibrate([300, 120, 300, 120, 600]);
  showToast(`🔔 Arrêt ${currentItinDestStop.name} dans moins de ${STOP_ALERT_RADIUS_M} m — préparez-vous à descendre !`, 'success', '🚏');
  stopStopAlert();
}

function stopStopAlert(notify) {
  if (stopAlertWatchId !== null) {
    navigator.geolocation.clearWatch(stopAlertWatchId);
    stopAlertWatchId = null;
  }
  const btn   = document.getElementById('stop-alert-btn');
  const label = document.getElementById('stop-alert-label');
  if (btn)   btn.classList.remove('active');
  if (label) label.textContent = "Activer l'alerte de descente";
  if (notify) showToast('Alerte de descente désactivée.', 'info', '🔕');
}

function buildRoute(from, to, line) {
  if (!line || !line.stopNames) return [from, to];

  // Utilise l'ordre officiel des arrêts de la ligne
  const ordered = line.stopNames
    .map(n => stops.find(s => s.name.toLowerCase() === n.toLowerCase()
                           || s.name.toLowerCase().includes(n.toLowerCase())
                           || n.toLowerCase().includes(s.name.toLowerCase())))
    .filter(Boolean);

  const fi = ordered.findIndex(s => s.name === from.name);
  const ti = ordered.findIndex(s => s.name === to.name);

  if (fi === -1 || ti === -1) return [from, to];

  const slice = fi <= ti ? ordered.slice(fi, ti+1) : ordered.slice(ti, fi+1).reverse();
  return slice.length >= 2 ? slice : [from, to];
}

// Hash stable d'un nom (pour générer un point de marche reproductible, pas aléatoire à chaque rendu)
function strHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

// Déplace un point lat/lng de `metres` dans la direction `bearingDeg`
function offsetLatLng(lat, lng, metres, bearingDeg) {
  const R = 6371000;
  const br = bearingDeg * Math.PI / 180;
  const lat1 = lat * Math.PI / 180, lng1 = lng * Math.PI / 180;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(metres / R) + Math.cos(lat1) * Math.sin(metres / R) * Math.cos(br));
  const lng2 = lng1 + Math.atan2(Math.sin(br) * Math.sin(metres / R) * Math.cos(lat1), Math.cos(metres / R) - Math.sin(lat1) * Math.sin(lat2));
  return { lat: lat2 * 180 / Math.PI, lng: lng2 * 180 / Math.PI };
}

// Estime une marche d'approche jusqu'à l'arrêt réel (l'utilisateur n'est pas toujours pile sur l'arrêt)
// + calcule le point de marche (départ ou destination) pour pouvoir tracer le trajet piéton sur la carte
function estimateWalkToStop(stop, seedSuffix) {
  const h = strHash(stop.name + seedSuffix);
  const metres  = 180 + (h % 220); // ~180-400 m, stable pour un même arrêt
  const mins    = Math.max(2, Math.round(metres / 75)); // ~4.5 km/h
  const bearing = h % 360;
  const point   = offsetLatLng(stop.lat, stop.lng, metres, bearing);
  return { metres, mins, point };
}

function renderTripDetail(from, to, route, line, busMins, walkIn, walkOut) {
  const el = document.getElementById('itin-trip-detail');
  const lineColor = line ? line.color : '#1a56c4';
  const horaireSem = line ? line.horaires.sem : '';

  walkIn  = walkIn  || estimateWalkToStop(from, 'in');
  walkOut = walkOut || estimateWalkToStop(to, 'out');
  const totalMins = walkIn.mins + busMins + walkOut.mins;

  let html = `
    <div style="background:${lineColor}14;border:1px solid ${lineColor}30;border-radius:12px;padding:14px 16px;margin-bottom:16px;font-size:13px;">
      <div style="font-weight:800;color:${lineColor};font-size:14px;margin-bottom:6px;">
        🚌 Ligne ${line ? line.num : '—'} · ${line ? line.name : ''}
      </div>
      <div style="color:var(--gray-600);line-height:1.6;">
        📅 ${horaireSem}<br>
        🗓️ Sam : ${line ? line.horaires.sam : ''}<br>
        🌞 Dim/Fériés : ${line ? line.horaires.dim : ''}
      </div>
      <div style="margin-top:8px;padding-top:8px;border-top:1px dashed ${lineColor}30;color:#059669;font-weight:700;">
        🚶 + 🚌 Trajet total estimé : ${fmt(totalMins)}
      </div>
      <div class="next-pass-live" id="next-pass-live"></div>
    </div>`;

  // Marche d'approche jusqu'à l'arrêt de départ
  html += `
    <div class="trip-step walk-step">
      <div class="trip-step-left">
        <div class="trip-step-dot"></div>
        <div class="trip-step-line dashed"></div>
      </div>
      <div class="trip-step-body">
        <div class="trip-step-label"><span class="trip-step-walk-icon">🚶</span>Marche jusqu'à l'arrêt ${from.icon || '🚏'} ${from.name}</div>
        <div class="trip-step-meta">${walkIn.metres} m · ${fmt(walkIn.mins)} à pied</div>
      </div>
    </div>`;

  route.forEach((stop, i) => {
    const isFirst = i === 0;
    const isLast  = i === route.length - 1;
    const dotCls  = isFirst ? '' : isLast ? 'end' : 'stop';
    const elapsed = isFirst ? `Montée · +${walkIn.mins} min`
                  : isLast  ? `Descente · +${walkIn.mins + busMins} min`
                  : `+${walkIn.mins + Math.round(busMins * i / (route.length-1))} min`;
    html += `
      <div class="trip-step">
        <div class="trip-step-left">
          <div class="trip-step-dot ${dotCls}" style="${isFirst ? `background:${lineColor};box-shadow:0 0 0 3px ${lineColor}30` : isLast ? 'background:var(--gold);box-shadow:0 0 0 3px rgba(245,158,11,.3)' : ''}"></div>
          <div class="trip-step-line ${dotCls==='stop'?'dashed':''}" style="${isFirst?`background:${lineColor}40`:''}"></div>
        </div>
        <div class="trip-step-body">
          <div class="trip-step-label">${stop.icon || '🚏'} ${stop.name}</div>
          <div class="trip-step-meta">${elapsed}</div>
        </div>
      </div>`;
  });

  // Marche finale jusqu'à la destination
  html += `
    <div class="trip-step walk-step">
      <div class="trip-step-left">
        <div class="trip-step-dot end" style="background:var(--gold);box-shadow:0 0 0 3px rgba(245,158,11,.3)"></div>
      </div>
      <div class="trip-step-body" style="padding-bottom:0;">
        <div class="trip-step-label"><span class="trip-step-walk-icon">🚶</span>Marche jusqu'à destination</div>
        <div class="trip-step-meta">${walkOut.metres} m · ${fmt(walkOut.mins)} à pied · arrivée +${totalMins} min</div>
      </div>
    </div>`;

  el.innerHTML = html;
}

function nearestRouteIdx(routeCoords, stop) {
  let best = 0, bestD = Infinity;
  routeCoords.forEach(([lat,lng], i) => {
    const d = Math.abs(lat - stop.lat) + Math.abs(lng - stop.lng);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}

function renderItinMap(from, to, route, line, walkIn, walkOut) {
  const lineColor = line ? line.color : '#1a56c4';
  walkIn  = walkIn  || estimateWalkToStop(from, 'in');
  walkOut = walkOut || estimateWalkToStop(to, 'out');

  // Utilise les routeCoords réelles de la ligne (waypoints routiers précis)
  let latlngs;
  if (line && line.routeCoords && line.routeCoords.length >= 2) {
    const rc = line.routeCoords;
    const fi = nearestRouteIdx(rc, from);
    const ti = nearestRouteIdx(rc, to);
    const slice = fi <= ti ? rc.slice(fi, ti + 1) : rc.slice(ti, fi + 1).reverse();
    latlngs = slice.length >= 2 ? slice : route.map(s => [s.lat, s.lng]);
  } else {
    latlngs = route.map(s => [s.lat, s.lng]);
  }

  // Trajet principal (bus)
  const poly = L.polyline(latlngs, {
    color: lineColor, weight: 6, opacity: .92,
    lineJoin: 'round', lineCap: 'round'
  }).addTo(itinMap);
  itinLayers.push(poly);

  // Trajet à pied : du point de départ jusqu'à l'arrêt de bus
  const walkInLine = L.polyline([[walkIn.point.lat, walkIn.point.lng], [from.lat, from.lng]], {
    color: '#059669', weight: 4, opacity: .85,
    dashArray: '2, 10', lineCap: 'round'
  }).addTo(itinMap);
  itinLayers.push(walkInLine);

  // Trajet à pied : de l'arrêt d'arrivée jusqu'à la destination
  const walkOutLine = L.polyline([[to.lat, to.lng], [walkOut.point.lat, walkOut.point.lng]], {
    color: '#059669', weight: 4, opacity: .85,
    dashArray: '2, 10', lineCap: 'round'
  }).addTo(itinMap);
  itinLayers.push(walkOutLine);

  // Arrêts intermédiaires
  route.slice(1, -1).forEach(s => {
    const m = L.circleMarker([s.lat, s.lng], {
      radius: 5, color: lineColor, fillColor: '#fff',
      fillOpacity: 1, weight: 2.5
    }).addTo(itinMap).bindPopup(`<b>${s.icon || '🚏'} ${s.name}</b>`);
    itinLayers.push(m);
  });

  // Point de départ piéton (point A réel de l'utilisateur)
  const mWalkStart = L.marker([walkIn.point.lat, walkIn.point.lng], {
    icon: makeIcon(`<div class="map-marker-walk">🚶</div>`, 30)
  }).addTo(itinMap).bindPopup(`<b>📍 Point de départ</b><br>${walkIn.metres} m à pied jusqu'à l'arrêt`);
  itinLayers.push(mWalkStart);

  // Marqueur arrêt départ bus
  const mFrom = L.marker([from.lat, from.lng], {
    icon: makeIcon(`<div class="map-marker-from">D</div>`)
  }).addTo(itinMap).bindPopup(`<b>🚌 Montée</b><br>${from.name}`).openPopup();
  itinLayers.push(mFrom);

  // Marqueur arrêt arrivée bus
  const mTo = L.marker([to.lat, to.lng], {
    icon: makeIcon(`<div class="map-marker-to">A</div>`)
  }).addTo(itinMap).bindPopup(`<b>🚌 Descente</b><br>${to.name}`);
  itinLayers.push(mTo);

  // Point d'arrivée piéton final (destination réelle)
  const mWalkEnd = L.marker([walkOut.point.lat, walkOut.point.lng], {
    icon: makeIcon(`<div class="map-marker-walk-end">🏁</div>`, 30)
  }).addTo(itinMap).bindPopup(`<b>🏁 Destination</b><br>${walkOut.metres} m à pied depuis l'arrêt`);
  itinLayers.push(mWalkEnd);

  // Zoom sur le trajet complet (marche + bus + marche)
  const bounds = L.latLngBounds(latlngs);
  bounds.extend([walkIn.point.lat, walkIn.point.lng]);
  bounds.extend([walkOut.point.lat, walkOut.point.lng]);
  itinMap.fitBounds(bounds, { padding: [40, 40] });
  setTimeout(() => itinMap.invalidateSize(), 100);
}

function showItinResult() {
  const sec = document.getElementById('itin-result-section');
  sec.classList.add('visible');
  sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeItinResult() {
  document.getElementById('itin-result-section').classList.remove('visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Fermer suggestions au clic extérieur
document.addEventListener('click', e => {
  if (!e.target.closest('.itin-field-wrap')) {
    document.querySelectorAll('.itin-suggestions').forEach(b => b.classList.remove('open'));
  }
});

// ── Lines table ───────────────────────────────────
let linesTextFilter   = '';
let linesStatusFilter = 'all';

function renderLinesTable() {
  const tbody = document.getElementById('lines-tbody');
  if (!tbody) return;
  const filtered = lines.filter(l => {
    const q = linesTextFilter.toLowerCase();
    const matchText = !q || [l.num,l.name,l.from,l.to].some(v => v.toLowerCase().includes(q));
    const matchStatus = linesStatusFilter === 'all' || l.status === linesStatusFilter;
    return matchText && matchStatus;
  });
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--gray-400)">Aucune ligne trouvée.</td></tr>`;
    return;
  }
  tbody.innerHTML = filtered.map(l => `
    <tr>
      <td><span class="pill pill-blue">${l.num}</span></td>
      <td style="font-weight:600">${l.name}</td>
      <td>${l.from}</td>
      <td>${l.to}</td>
      <td>Toutes les <strong>${l.freq}</strong> min</td>
      <td>${statusPill(l.status)}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="toggleLineStatus('${l.num}')">Changer statut</button>
      </td>
    </tr>`).join('');
}

function filterLines(val)         { linesTextFilter = val;   renderLinesTable(); }
function filterLinesByStatus(val) { linesStatusFilter = val; renderLinesTable(); }

function toggleLineStatus(num) {
  const l = lines.find(x => x.num === num);
  if (!l) return;
  const cycle = { active:'delayed', delayed:'suspended', suspended:'active' };
  l.status = cycle[l.status] || 'active';
  renderLinesTable();
  renderStatusBoard();
  renderHeroStatus();
  updateHeroKPIs();
  toast(`Ligne ${num} — statut mis à jour : ${l.status}`, 'info');
}

function addLine(e) {
  e.preventDefault();
  const num = document.getElementById('new-line-num').value.toUpperCase();
  if (lines.find(l => l.num === num)) { toast(`La ligne ${num} existe déjà.`, 'error'); return; }
  lines.push({
    num, ponct:100,
    name:   document.getElementById('new-line-name').value,
    from:   document.getElementById('new-line-from').value,
    to:     document.getElementById('new-line-to').value,
    freq:   parseInt(document.getElementById('new-line-freq').value),
    status: document.getElementById('new-line-status').value,
  });
  e.target.reset();
  closeModal('add-line-modal');
  renderLinesTable();
  renderStatusBoard();
  renderHeroStatus();
  toast(`Ligne ${num} ajoutée avec succès.`, 'success');
}

// ── Incidents (timeline view) ─────────────────────
function activeIncidentFilter() {
  return document.getElementById('inc-filter-select')?.value || 'all';
}

function renderIncidentTimeline(filter='all') {
  const el = document.getElementById('incident-timeline');
  if (!el) return;
  const filtered = filter === 'all' ? incidents
    : incidents.filter(i => filter === 'open' ? i.status === 'open' : i.status === 'resolved');
  if (!filtered.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">✅</div><p>Aucun incident pour ce filtre.</p></div>`;
    return;
  }
  el.innerHTML = filtered.map((inc, idx) => `
    <div class="timeline-item">
      <div class="timeline-left">
        <div class="timeline-dot ${inc.severity}"></div>
        ${idx < filtered.length-1 ? '<div class="timeline-line"></div>' : ''}
      </div>
      <div class="timeline-body">
        <div class="timeline-top">
          <span class="timeline-id">${inc.id}</span>
          ${severityPill(inc.severity)}
          ${incStatusPill(inc.status)}
        </div>
        <div class="timeline-desc">${inc.desc}</div>
        <div class="timeline-meta">
          <span>📅 ${inc.date} à ${inc.time}</span>
          <span>🚌 Ligne ${inc.line}</span>
          ${inc.status === 'open'
            ? `<button class="btn btn-sm btn-primary" style="margin-left:auto" onclick="resolveIncident('${inc.id}')">✓ Résoudre</button>`
            : `<span style="color:var(--green);font-size:12px;font-weight:700;margin-left:auto">✓ Résolu</span>`}
        </div>
      </div>
    </div>`).join('');
}

function filterIncidents(val) { renderIncidentTimeline(val); }

function resolveIncident(id) {
  const inc = incidents.find(i => i.id === id);
  if (!inc) return;
  inc.status = 'resolved';
  renderIncidentTimeline(activeIncidentFilter());
  updateHeroKPIs();
  renderTicker();
  toast(`Incident ${id} marqué comme résolu.`, 'success');
}

function addIncident(e) {
  e.preventDefault();
  const now = new Date();
  const pad = n => String(n).padStart(2,'0');
  incIdCounter++;
  const newInc = {
    id:       'INC-' + String(incIdCounter).padStart(3,'0'),
    date:     `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`,
    time:     `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    line:     document.getElementById('new-inc-line').value,
    desc:     document.getElementById('new-inc-desc').value,
    severity: document.getElementById('new-inc-severity').value,
    status:   'open',
  };
  incidents.unshift(newInc);
  e.target.reset();
  closeModal('add-incident-modal');
  renderIncidentTimeline(activeIncidentFilter());
  updateHeroKPIs();
  renderTicker();
  toast(`Incident ${newInc.id} signalé.`, 'warning');
}

// ── Stats & charts ────────────────────────────────
function animateStats() {
  // Animated counter for voyageurs
  const el = document.getElementById('stat-voyageurs');
  if (el) animateCounter(el, 8420, 1500);

  // Progress ring (ponctualité 91%)
  const ring = document.getElementById('ring-fill');
  if (ring) {
    const r = 52, circ = 2 * Math.PI * r;
    ring.style.strokeDasharray  = circ;
    ring.style.strokeDashoffset = circ;
    setTimeout(() => {
      ring.style.strokeDashoffset = circ * (1 - 0.91);
    }, 200);
  }

  // Progress bars
  const pbData = [
    { label:'L1', val:94, color:'#22c55e' },
    { label:'L2', val:89, color:'#4ade80' },
    { label:'L3', val:72, color:'#f59e0b' },
    { label:'L4', val:91, color:'#22c55e' },
    { label:'L5', val:88, color:'#4ade80' },
    { label:'L6', val:96, color:'#22c55e' },
    { label:'L8', val:85, color:'#4ade80' },
  ];
  const pbEl = document.getElementById('progress-bars');
  if (pbEl) {
    pbEl.innerHTML = pbData.map(d => `
      <div class="progress-bar-row">
        <div class="progress-bar-label">
          <span><strong>${d.label}</strong></span>
          <span style="color:var(--gray-500)">${d.val}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:0%;background:${d.color}" data-w="${d.val}%"></div>
        </div>
      </div>`).join('');
    // Animate bars
    setTimeout(() => {
      pbEl.querySelectorAll('.progress-bar-fill').forEach(b => { b.style.width = b.dataset.w; });
    }, 100);
  }
}

function renderCharts() {
  const freqData = [
    { label:'L1', val:3200 }, { label:'L2', val:2100 }, { label:'L3', val:980  },
    { label:'L4', val:1540 }, { label:'L5', val:1820 }, { label:'L6', val:2640 },
    { label:'L7', val:420  }, { label:'L8', val:1380 },
  ];
  const punctData = [
    { label:'Jan', val:88 }, { label:'Fév', val:85 }, { label:'Mar', val:90 },
    { label:'Avr', val:87 }, { label:'Mai', val:92 }, { label:'Jun', val:91 },
  ];
  renderBarChart('freq-chart',  freqData,  v => (v/1000).toFixed(1)+'k', 'var(--blue)',  v => v+' voyageurs');
  renderBarChart('punct-chart', punctData, v => v+'%',                    'var(--green)', v => v+'%', 100);
}

function renderBarChart(id, data, fmtVal, color, fmtTip, fixedMax) {
  const el = document.getElementById(id);
  if (!el) return;
  const max = fixedMax || Math.max(...data.map(d => d.val));
  el.innerHTML = data.map(d => {
    const h = Math.round((d.val / max) * 140);
    return `<div class="chart-bar-group">
      <div class="chart-tooltip">${fmtTip(d.val)}</div>
      <div class="chart-val">${fmtVal(d.val)}</div>
      <div class="chart-bar" style="height:0;background:${color}" data-h="${h}px" title="${fmtTip(d.val)}"></div>
      <div class="chart-label">${d.label}</div>
    </div>`;
  }).join('');
  // Animate bars
  setTimeout(() => el.querySelectorAll('.chart-bar').forEach(b => { b.style.height = b.dataset.h; }), 80);
}

// ── Modals ────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
  if (id === 'add-incident-modal' || id === 'add-trajet-modal') {
    const selId = id === 'add-incident-modal' ? 'new-inc-line' : 'trajet-line';
    document.getElementById(selId).innerHTML =
      lines.map(l => `<option value="${l.num}">${l.num} — ${l.name}</option>`).join('');
  }
  if (id === 'edit-profil-modal') {
    document.getElementById('profil-nom').value   = compte.nom;
    document.getElementById('profil-email').value = compte.email;
    document.getElementById('profil-role').value  = compte.role;
  }
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function closeModalOnOverlay(e, id) { if (e.target === e.currentTarget) closeModal(id); }

// ── Mon Compte ────────────────────────────────────
const titreLabels = { mensuel:'Abonnement mensuel', hebdo:'Abonnement hebdomadaire', carnet:'Carnet 10 voyages', journee:'Ticket journée', annuel:'Abonnement annuel' };
const lieuEmojis  = { home:'🏠', work:'💼', other:'📍' };

function expiryBadge(dateStr) {
  const days = Math.round((new Date(dateStr) - new Date()) / 86400000);
  if (days < 0)   return `<span class="titre-expiry-badge expiry-expired">Expiré</span>`;
  if (days <= 14) return `<span class="titre-expiry-badge expiry-soon">Expire dans ${days}j</span>`;
  return `<span class="titre-expiry-badge expiry-ok">Valide jusqu'au ${new Date(dateStr).toLocaleDateString('fr-FR')}</span>`;
}

function renderProfil() {
  const initials = compte.nom.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('compte-avatar').textContent  = initials;
  document.getElementById('compte-nom').textContent     = compte.nom;
  document.getElementById('compte-role').textContent    = `${compte.role} · CADEMA Mayotte`;
  document.getElementById('compte-email').textContent   = compte.email;
  document.getElementById('header-avatar').textContent  = initials;
  document.getElementById('header-name').textContent    = compte.nom;
}

function saveProfil(e) {
  e.preventDefault();
  compte.nom   = document.getElementById('profil-nom').value;
  compte.email = document.getElementById('profil-email').value;
  compte.role  = document.getElementById('profil-role').value;
  saveCompte(); renderProfil(); closeModal('edit-profil-modal');
  toast('Profil mis à jour.', 'success');
}

function renderTitres() {
  const el = document.getElementById('titres-list');
  if (!el) return;
  if (!compte.titres.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🎫</div><p>Aucun titre enregistré.</p></div>`;
    return;
  }
  el.innerHTML = compte.titres.map(t => `
    <div class="titre-item">
      <div class="titre-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg></div>
      <div class="titre-info">
        <div class="titre-name">${titreLabels[t.type]||t.type}</div>
        <div class="titre-meta">N° ${t.num}</div>
      </div>
      ${expiryBadge(t.expiry)}
      <button class="delete-btn" onclick="deleteTitre(${t.id})" title="Supprimer">×</button>
    </div>`).join('');
}

function addTitre(e) {
  e.preventDefault();
  titreIdCtr++;
  compte.titres.push({ id:titreIdCtr, type:document.getElementById('titre-type').value, num:document.getElementById('titre-num').value, expiry:document.getElementById('titre-expiry').value });
  saveCompte(); e.target.reset(); closeModal('add-titre-modal'); renderTitres();
  toast('Titre de transport enregistré.', 'success');
}
function deleteTitre(id) {
  compte.titres = compte.titres.filter(t=>t.id!==id);
  saveCompte(); renderTitres(); toast('Titre supprimé.', 'info');
}

function renderLieux() {
  const el = document.getElementById('lieux-list');
  if (!el) return;
  if (!compte.lieux.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📍</div><p>Aucun lieu enregistré.</p></div>`;
    return;
  }
  el.innerHTML = compte.lieux.map(l => `
    <div class="lieu-item">
      <div class="lieu-icon">${lieuEmojis[l.type]||'📍'}</div>
      <div class="lieu-info">
        <div class="lieu-name">${l.nom}</div>
        <div class="lieu-adresse">${l.adresse}</div>
      </div>
      <button class="delete-btn" onclick="deleteLieu(${l.id})" title="Supprimer">×</button>
    </div>`).join('');
}

function addLieu(e) {
  e.preventDefault();
  lieuIdCtr++;
  compte.lieux.push({ id:lieuIdCtr, type:document.getElementById('lieu-type').value, nom:document.getElementById('lieu-nom').value, adresse:document.getElementById('lieu-adresse').value });
  saveCompte(); e.target.reset(); closeModal('add-lieu-modal'); renderLieux();
  toast('Lieu favori enregistré.', 'success');
}
function deleteLieu(id) {
  compte.lieux = compte.lieux.filter(l=>l.id!==id);
  saveCompte(); renderLieux(); toast('Lieu supprimé.', 'info');
}

function renderTrajets() {
  const el = document.getElementById('trajets-list');
  if (!el) return;
  if (!compte.trajets.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🗺️</div><p>Aucun trajet enregistré.</p></div>`;
    return;
  }
  el.innerHTML = compte.trajets.map(t => `
    <div class="trajet-card">
      <div class="trajet-card-header">
        <span class="trajet-card-name">${t.nom}</span>
        <button class="delete-btn" onclick="deleteTrajet(${t.id})">×</button>
      </div>
      <div class="trajet-route"><span>${t.from}</span><span class="trajet-arrow">→</span><span>${t.to}</span></div>
      <div class="trajet-meta">
        <span class="trajet-badge">${t.line}</span>
        <span class="trajet-badge" style="background:var(--purple-light);color:var(--purple)">${t.heure}</span>
        <span class="trajet-jours">${t.jours.join(' · ')}</span>
      </div>
    </div>`).join('');
}

function addTrajet(e) {
  e.preventDefault();
  const jours = [...document.querySelectorAll('#jours-checks input:checked')].map(cb=>cb.value);
  trajetIdCtr++;
  compte.trajets.push({ id:trajetIdCtr, nom:document.getElementById('trajet-nom').value, from:document.getElementById('trajet-from').value, to:document.getElementById('trajet-to').value, line:document.getElementById('trajet-line').value, heure:document.getElementById('trajet-heure').value, jours });
  saveCompte(); e.target.reset(); closeModal('add-trajet-modal'); renderTrajets();
  toast('Trajet fréquent enregistré.', 'success');
}
function deleteTrajet(id) {
  compte.trajets = compte.trajets.filter(t=>t.id!==id);
  saveCompte(); renderTrajets(); toast('Trajet supprimé.', 'info');
}

function renderHistorique(days='all') {
  const tbody = document.getElementById('historique-tbody');
  if (!tbody) return;
  let data = compte.historique;
  if (days !== 'all') {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - parseInt(days));
    data = data.filter(h => new Date(h.date) >= cutoff);
  }
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:28px;color:var(--gray-400)">Aucun voyage sur cette période.</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(h => `
    <tr>
      <td>${new Date(h.date).toLocaleDateString('fr-FR')}</td>
      <td>${h.heure}</td>
      <td><span class="pill pill-blue">${h.line}</span></td>
      <td>${h.from}</td>
      <td>${h.to}</td>
      <td><strong>${h.duree}</strong></td>
      <td>${h.titre}</td>
    </tr>`).join('');
}
function filterHistorique(val) { renderHistorique(val); }

// ═══════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════
(function init() {
  renderTicker();
  renderHeroStatus();
  renderStatusBoard();
  updateHeroKPIs();
  renderLinesTable();
  renderIncidentTimeline();
  renderProfil();
  renderTitres();
  renderLieux();
  renderTrajets();
  renderHistorique();

  // Observe hero for counter animation
  const heroEl = document.querySelector('.hero-kpis');
  if (heroEl) heroObserver.observe(heroEl);
})();
