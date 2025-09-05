// A simple service worker for caching static assets

const CACHE_NAME = 'shram-sarathi-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Since we are using CDN imports, we won't cache them explicitly here
  // as they are likely cached by the browser already. Caching the main
  // entry points is sufficient for a basic offline experience.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  // For requests to external resources (like the CDN), use a network-first strategy.
  if (event.request.url.startsWith('http')) {
     event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
     );
     return;
  }

  // For local assets, use a cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Cache hit
        }

        return fetch(event.request).then(
          fetchResponse => {
            // Check if we received a valid response
            if(!fetchResponse || fetchResponse.status !== 200) {
              return fetchResponse;
            }

            const responseToCache = fetchResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          }
        );
      })
    );
});

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
});
