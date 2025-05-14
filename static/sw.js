const CACHE_NAME = "qr-cache-v1";
const urlsToCache = [
  "/",
  "/static/styles.css",
  "/static/js/scanner.js",
  "/static/js/html5-qrcode.min.js", // <-- 🔧 necesario para escaneo offline
  "/static/manifest.json",
  "/static/icon-192.png",
  "/static/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
