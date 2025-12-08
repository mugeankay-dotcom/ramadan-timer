const CACHE_NAME = 'ramadan-timer-v39.1';
const ASSETS = [
    './',
    './index.html',
    './style.css?v=39',
    './app.js',
    './manifest.json?v=39',
    './crystal_gem.svg',
    './icon-kabe-192.png',
    './icon-kabe-512.png',
    './masjid_bg.png'
];

self.addEventListener('install', (e) => {
    self.skipWaiting(); // Force new SW to take control immediately
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key); // Remove old caches
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
