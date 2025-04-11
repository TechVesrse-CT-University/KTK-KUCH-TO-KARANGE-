
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.

// Cache names
const CACHE_NAME = 'rescue-grid-cache-v1';
const STATIC_CACHE_NAME = 'rescue-grid-static-v1';
const DYNAMIC_CACHE_NAME = 'rescue-grid-dynamic-v1';
const DATA_CACHE_NAME = 'rescue-grid-data-v1';

// Assets to preload into static cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/offline.html',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon.png',
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('Error caching static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete outdated caches except firebase messaging
          if (
            cacheName !== STATIC_CACHE_NAME &&
            cacheName !== DYNAMIC_CACHE_NAME &&
            cacheName !== DATA_CACHE_NAME &&
            cacheName !== 'firebase-messaging-sw-v1' &&
            cacheName.startsWith('rescue-grid')
          ) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        }).filter(Boolean)
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - caching strategy for different requests
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip service worker handling for firebase auth and firestore requests
  if (
    event.request.url.includes('firebasestorage.googleapis.com') ||
    event.request.url.includes('firebaseauth') ||
    event.request.url.includes('firestore') ||
    event.request.url.includes('googleapis.com')
  ) {
    return;
  }
  
  // Use a stale-while-revalidate strategy for API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => {
            return cache.match(event.request);
          });
      })
    );
    return;
  }
  
  // Cache-first strategy for static assets
  if (
    event.request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/) ||
    event.request.url.includes('/static/')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Update cache in the background
          fetch(event.request).then((response) => {
            if (response.status === 200) {
              caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(event.request, response);
              });
            }
          }).catch(() => { /* Ignore errors */ });
          return cachedResponse;
        }
        
        // Fetch and cache if not in cache
        return fetch(event.request).then((response) => {
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        }).catch(() => {
          // If both fetch and cache fail, show offline page
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          return new Response('Network error');
        });
      })
    );
    return;
  }
  
  // Network-first strategy for HTML documents
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return caches.match('/offline.html');
          });
        })
    );
    return;
  }
  
  // Default: Stale-while-revalidate for everything else
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Update cache in background
        fetch(event.request).then((response) => {
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
          });
        }).catch(() => { /* Ignore errors */ });
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Show offline page on navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          // Return placeholder for images
          if (event.request.destination === 'image') {
            return caches.match('/icons/offline-image.png');
          }
          return new Response('Network error');
        });
    })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? { 
    title: 'New Alert', 
    body: 'A new emergency alert has been received.' 
  };
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/notification-badge.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const url = event.notification.data?.url || '/';
      
      // Check if a window is already open and navigate to the URL
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-emergency-data') {
    event.waitUntil(syncEmergencyData());
  }
});

// Function to sync emergency data
async function syncEmergencyData() {
  try {
    // Get all unsync'd items from IndexedDB
    // Implementation will depend on your IndexedDB structure
    console.log('Syncing emergency data in the background');
    
    // For now just log that sync would happen here
    // In a real implementation, you would:
    // 1. Retrieve pending items from IndexedDB
    // 2. Send them to your server/Firebase
    // 3. Clear the items from IndexedDB after successful sync
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}