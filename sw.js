const CACHE_NAME = 'h3-amber-cache-v3.6.1';
const urlsToCache = [
  './',
  './index.html',
  './qrcode.min.js',
  './OG82.png',
  './manifest.json'
];

// インストール時にファイルをキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 新しいバージョンがあれば古いキャッシュを削除
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// オフライン時はキャッシュから返す（Network First, fallback to Cache）
self.addEventListener('fetch', event => {
  // Google Analytics等の外部リクエストはキャッシュの対象外とする
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
