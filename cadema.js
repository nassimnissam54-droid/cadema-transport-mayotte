'use strict';
// ═══════════════════════════════════════════════════
//  CADEMA — JS principal
// ═══════════════════════════════════════════════════

// ── Données ──────────────────────────────────────
let incIdCounter = 5;

const lines = [
  { num:'L1', name:'Mamoudzou — Koungou',      from:'Mamoudzou', to:'Koungou',      freq:20, status:'active',    ponct:94 },
  { num:'L2', name:'Mamoudzou — Bandraboua',   from:'Mamoudzou', to:'Bandraboua',   freq:30, status:'active',    ponct:89 },
  { num:'L3', name:'Mamoudzou — Bouéni',        from:'Mamoudzou', to:'Bouéni',        freq:45, status:'delayed',   ponct:72 },
  { num:'L4', name:'Mamoudzou — Kani-Kéli',    from:'Mamoudzou', to:'Kani-Kéli',    freq:60, status:'active',    ponct:91 },
  { num:'L5', name:'Mamoudzou — Sada',          from:'Mamoudzou', to:'Sada',          freq:30, status:'active',    ponct:88 },
  { num:'L6', name:'Dzaoudzi — Pamandzi',       from:'Dzaoudzi',  to:'Pamandzi',     freq:15, status:'active',    ponct:96 },
  { num:'L7', name:'Koungou — Mtsangamouji',   from:'Koungou',   to:'Mtsangamouji', freq:40, status:'suspended', ponct:0  },
  { num:'L8', name:'Mamoudzou — Ouangani',      from:'Mamoudzou', to:'Ouangani',      freq:35, status:'active',    ponct:85 },
];

const incidents = [
  { id:'INC-001', date:'2026-06-27', time:'07:42', line:'L3', desc:'Retard important — accident sur la RN1 à Dembéni',          severity:'high',   status:'open' },
  { id:'INC-002', date:'2026-06-27', time:'09:15', line:'L7', desc:'Suspension temporaire — route impraticable suite aux pluies', severity:'high',   status:'open' },
  { id:'INC-003', date:'2026-06-27', time:'11:03', line:'L1', desc:'Panne mécanique bus n°14 — remplacement en cours',           severity:'medium', status:'open' },
  { id:'INC-004', date:'2026-06-26', time:'14:30', line:'L2', desc:'Retard 15 min — manifestation à Kawéni',                     severity:'low',    status:'resolved' },
  { id:'INC-005', date:'2026-06-25', time:'08:00', line:'L5', desc:'Arrêt Sada fermé temporairement — travaux voirie',           severity:'medium', status:'resolved' },
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
      { id:1, type:'home', nom:'Domicile',      adresse:'Arrêt Koungou Marché' },
      { id:2, type:'work', nom:'Bureau CADEMA', adresse:'Arrêt Mamoudzou Centre' },
    ],
    trajets:[
      { id:1, nom:'Domicile → Travail', from:'Koungou',    to:'Mamoudzou', line:'L1', heure:'07:30', jours:['Lun','Mar','Mer','Jeu','Ven'] },
      { id:2, nom:'Travail → Domicile', from:'Mamoudzou',  to:'Koungou',   line:'L1', heure:'17:15', jours:['Lun','Mar','Mer','Jeu','Ven'] },
    ],
    historique:[
      { date:'2026-06-27', heure:'07:32', line:'L1', from:'Koungou',    to:'Mamoudzou',  duree:'38 min', titre:'Abonnement mensuel' },
      { date:'2026-06-26', heure:'17:18', line:'L1', from:'Mamoudzou',  to:'Koungou',    duree:'41 min', titre:'Abonnement mensuel' },
      { date:'2026-06-26', heure:'07:31', line:'L1', from:'Koungou',    to:'Mamoudzou',  duree:'36 min', titre:'Abonnement mensuel' },
      { date:'2026-06-25', heure:'17:22', line:'L1', from:'Mamoudzou',  to:'Koungou',    duree:'39 min', titre:'Abonnement mensuel' },
      { date:'2026-06-24', heure:'07:35', line:'L2', from:'Koungou',    to:'Bandraboua', duree:'22 min', titre:'Carnet 10 voyages' },
      { date:'2026-06-23', heure:'09:10', line:'L6', from:'Dzaoudzi',   to:'Pamandzi',   duree:'12 min', titre:'Carnet 10 voyages' },
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

// ── Clock ─────────────────────────────────────────
function updateClock() {
  const el = document.getElementById('live-clock');
  if (el) el.textContent = new Date().toLocaleTimeString('fr-FR');
}
setInterval(updateClock, 1000);
updateClock();

// ── Dark mode ─────────────────────────────────────
function toggleDark() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('dark-btn').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('cadema_theme', isDark ? 'light' : 'dark');
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
  window.scrollTo({ top:0, behavior:'smooth' });
  if (id === 'stats' && !chartsRendered) { chartsRendered = true; renderCharts(); }
  if (id === 'stats' && !statsAnimated)  { statsAnimated  = true; animateStats(); }
}

function toggleNav() {
  document.getElementById('main-nav').classList.toggle('open');
  document.getElementById('burger-btn').classList.toggle('open');
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

// ── Planificateur d'itinéraire ──────────────────────
function swapItinerary() {
  const from = document.getElementById('itin-from');
  const to   = document.getElementById('itin-to');
  const tmp  = from.value;
  from.value = to.value;
  to.value   = tmp;
}

function searchItinerary() {
  const from = document.getElementById('itin-from').value.trim();
  const to   = document.getElementById('itin-to').value.trim();
  if (!from || !to) {
    showToast('Veuillez renseigner le départ et la destination.', 'warning', '📍');
    return;
  }
  // Cherche une ligne correspondante dans les données
  const q = (s) => s.toLowerCase();
  const match = lines.find(l =>
    (q(l.from).includes(q(from)) || q(l.name).includes(q(from))) &&
    (q(l.to).includes(q(to)) || q(l.name).includes(q(to)))
  ) || lines.find(l =>
    q(l.name).includes(q(from)) || q(l.name).includes(q(to)) ||
    q(l.from).includes(q(from)) || q(l.to).includes(q(to))
  );

  if (match) {
    showToast(`Itinéraire trouvé : ${match.num} — ${match.name} (toutes les ${match.freq} min)`, 'success', '🗺️');
    showSection('lignes');
    const inp = document.getElementById('lines-search');
    if (inp) { inp.value = match.num; filterLines(match.num); }
  } else {
    showToast(`Aucune ligne directe trouvée entre "${from}" et "${to}".`, 'warning', '🔍');
  }
}

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
