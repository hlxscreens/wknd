// Service Worker: sw.js

// Define a cache name
const cacheName = 'my-cache-v1';

// List of URLs to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  // Add more URLs here
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(urlsToCache))
      .catch(error => console.error('Cache installation failed:', error))
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(name => {
            if (name !== cacheName) {
              return caches.delete(name);
            }
          })
        );
      })
      .catch(error => console.error('Cache activation failed:', error))
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return cached response if available
        }

        // If not cached, fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Cache the fetched response
            if (networkResponse) {
              const clonedResponse = networkResponse.clone();
              caches.open(cacheName)
                .then(cache => {
                  cache.put(event.request, clonedResponse);
                });
            }
            return networkResponse;
          })
          .catch(error => console.error('Fetch failed:', error));
      })
      .catch(error => console.error('Cache match failed:', error))
  );
});
