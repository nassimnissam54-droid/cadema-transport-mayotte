// CADEMA — Service Worker : mode hors-ligne (horaires & pages en cache)
const CACHE = 'cadema-v3';
const PRECACHE = [
  './',
  './index.html',
  './cadema.css',
  './portails.css',
  './cadema.js',
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

// Stratégie : network-first pour nos fichiers (toujours à jour si en ligne),
// cache-first pour les ressources externes (tuiles carte, fonts, Leaflet CDN).
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  if (url.origin === location.origin) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request).then((m) => m || caches.match('./index.html')))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((m) =>
        m || fetch(e.request).then((res) => {
          // Ne met en cache que les ressources statiques utiles (fonts, leaflet, tuiles)
          if (/tile\.openstreetmap\.org|unpkg\.com|fonts\.(googleapis|gstatic)\.com/.test(url.host)) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
      )
    );
  }
});
