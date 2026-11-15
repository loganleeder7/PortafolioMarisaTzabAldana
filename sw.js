const CACHE_NAME = 'portfolio-v2';
const PRECACHE = [
  './',
  './index.html',
  './offline.html',
  './css/bootstrap.min.css',
  './css/styles.css',
  './js/theme-init.js',
  './js/main.js',
  './js/bootstrap.bundle.min.js',
  './assets/vendor/aos/aos.css',
  './assets/vendor/aos/aos.js',
  './assets/vendor/anime/anime.min.js',
  './assets/vendor/vanilla-tilt/vanilla-tilt.min.js',
  './assets/vendor/canvas-confetti/confetti.min.js',
  './assets/vendor/typed.js/typed.umd.js',
  './assets/vendor/gsap/gsap.min.js',
  './assets/vendor/gsap/ScrollTrigger.min.js',
  './assets/vendor/particles/particles.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() =>
        caches.match('./offline.html').then((r) => r || caches.match('./index.html'))
      )
    );
    return;
  }

  const isProbe = new URL(req.url).searchParams.has('_t');
  if (isProbe) {
    event.respondWith(fetch(req));
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
