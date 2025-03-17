self.addEventListener('install', e => {
    e.waitUntil(caches.open('pws-cache-v1')
        .then(cache => cache.addAll(
            [
                './',
                './index.html',
                './pages/competences.html',
                './pages/contact.html',
                './pages/cv.html',
                './pages/portfolio.html',

                './css/styles.min.css',
                './css/fonts/veteran_typewriter.ttf',

                './js/app.min.js',
                './js/download.min.js',
                './js/html2canvas.min.js',
                './js/jspdf.min.js',
                './js/modules/pdf.min.js',
                './js/modules/skill.min.js',
                './js/modules/skills.min.js',

                './assets/cursor.webp',
                './assets/favicon-full.webp',
                './assets/favicon.webp',
                './assets/grunge.webp',
                './assets/postit.webp',

                './images/chess.webp',
                './images/photo.webp',
                './images/roulette.webp',
                './images/submodule.webp',
            ]
        )))
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request)
        .then(res => res || fetch(e.request)))
});