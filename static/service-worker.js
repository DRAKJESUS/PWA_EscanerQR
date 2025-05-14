self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('qr-cache').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',  // importante para modo offline
                '/static/styles.css',
                '/static/js/scanner.js',
                '/static/js/sync.js',
                '/static/manifest.json',
                '/static/icon-192.png'  // si lo tienes
            ]);
        })
    );
    console.log('📦 Service Worker instalado');
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                return caches.match('/index.html');  // fallback
            });
        })
    );
});
