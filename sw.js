// Офлайн-режим: оболочка приложения кэшируется, данные всегда идут по сети.
const CACHE = 'daftar-5';
const SHELL = ['./', './index.html', './config.js', './manifest.json',
               './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Firebase, шрифты и прочее чужое — только сеть, не кэшируем
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  // Свои файлы: сеть первой, кэш как запасной вариант
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return r;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
