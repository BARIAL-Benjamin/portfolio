self.addEventListener('install', e => {
    e.waitUntil(caches.open('pws-cache-v1')
        .then(cache => cache.addAll(
            [
                '/',
                '/index.html',
                '/css/styles.min.css',
                '/js/app.min.js',
                '/assets/favicon.webp'
            ]
        )))
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request)
        .then(res => res || fetch(e.request)))
});