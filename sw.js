const CACHE_NAME = 'ramadan-timer-v2';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './masjid_bg.png',
    './manifest.json'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
