const CACHE_NAME = 'mstory-cache-v4';
const ASSETS = [
  '/', 
  '/index.html',
  '/manifest.json',
  '/src/styles/styles.css',
  '/src/scripts/index.js',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((n) => n !== CACHE_NAME && caches.delete(n)))
    )
  );
  self.clients.claim();
  console.log(' Service Worker activated');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return (
        res ||
        fetch(event.request).then((fetchRes) => {
          if (event.request.url.includes('/v1/stories')) {
            const clone = fetchRes.clone();
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(event.request, clone)
            );
          }
          return fetchRes;
        }).catch(() => caches.match('/index.html'))
      );
    })
  );
});

self.addEventListener('push', (event) => {
  let payload = { title: 'MStory', body: 'Ada story baru!', data: { url: '/' } };

  try {
    if (event.data) payload = event.data.json();
  } catch (e) {
    console.warn('Push data bukan JSON, gunakan default');
  }

  const options = {
    body: payload.body,
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png',
    data: payload.data
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(target));
});
