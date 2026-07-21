// CADEMA — Service Worker : mode hors-ligne (horaires & pages en cache)
const CACHE = 'cadema-v5';
const PRECACHE = [
  './',
  './index.html',
  './cadema.css',
  './portails.css',
  './cadema.js',
  './leaflet.js',
  './leaflet.css',
  './widget.html',
  './agent.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Stratégie : network-first pour NOS fichiers uniquement (toujours à jour en ligne,
// disponibles hors-ligne). Les ressources externes (tuiles de carte OpenStreetMap,
// fonts, géocodage) ne sont PAS interceptées : elles vont directement au réseau.
// (Les intercepter et les mettre en cache pouvait figer des tuiles cassées.)
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((m) => m || caches.match('./index.html')))
  );
});
