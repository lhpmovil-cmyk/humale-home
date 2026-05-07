const CACHE_NAME = 'humale-home-v3';
const urlsToCache = ['./index.html', './icon-192.png', './icon-512.png', './manifest.json'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(urlsToCache);
  }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  // Never cache Firebase, Google APIs or external requests
  if(url.indexOf('firebase') !== -1 || url.indexOf('googleapis') !== -1 || url.indexOf('gstatic') !== -1) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Cache first for local assets
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/humale-home/'));
});
