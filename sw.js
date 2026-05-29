// ============================================
// ENGLISH GRAMMAR MASTER — Service Worker
// Version: 5.1.0 | Fixed offline functionality
// ============================================

const CACHE_VERSION = 'egm-v5.1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const FONT_CACHE = `${CACHE_VERSION}-fonts`;
const JS_MODULE_CACHE = `${CACHE_VERSION}-modules`;

// Core App Shell — MUST be available offline
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './offline.html',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  // New modular files
  './js/app.js',
  './js/modules/storage.js',
  './js/modules/security.js',
  './js/modules/theme.js',
  './js/modules/gamification.js',
  './js/modules/quiz.js',
  './js/modules/flashcards.js',
  './js/modules/ui.js',
  './js/modules/performance.js',
  './js/modules/advanced.js',
  './js/modules/ux-enhancements.js'
];

// External resources that should be cached
const EXTERNAL_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2'
];

// Cache size limits
const MAX_DYNAMIC_ITEMS = 50;
const MAX_IMAGE_ITEMS = 100;

// ============================================
// INSTALL — Cache App Shell + External Assets
// ============================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');

  // Skip waiting immediately for faster updates
  self.skipWaiting();

  event.waitUntil(
    Promise.all([
      // Cache app shell
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching app shell...');
        return cache.addAll(APP_SHELL);
      }),

      // Cache external assets (fonts, icons)
      caches.open(FONT_CACHE).then((cache) => {
        console.log('[SW] Caching external assets...');
        return cache.addAll(EXTERNAL_ASSETS).catch(err => {
          console.warn('[SW] Some external assets failed:', err);
        });
      })
    ]).then(() => {
      console.log('[SW] Install complete');
    }).catch((err) => {
      console.error('[SW] Install failed:', err);
    })
  );
});

// ============================================
// ACTIVATE — Clean old caches + Claim clients
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            // Delete caches that don't start with current version
            return name.startsWith('egm-') && !name.startsWith(CACHE_VERSION);
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// ============================================
// FETCH — Smart caching strategies
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Strategy selection based on request type
  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigation(request));
  } else if (isImageRequest(request, url)) {
    event.respondWith(handleImage(request));
  } else if (isFontRequest(request, url)) {
    event.respondWith(handleFont(request));
  } else if (isJSModule(request, url)) {
    event.respondWith(handleJSModule(request));
  } else if (isStaticAsset(request, url)) {
    event.respondWith(handleStaticAsset(request));
  } else {
    event.respondWith(handleDynamic(request));
  }
});

// ============================================
// STRATEGY: Navigation (Network First → Cache → Offline)
// ============================================
async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error('Network response not ok');
  } catch (error) {
    console.log('[SW] Navigation failed, trying cache...');

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    console.log('[SW] Serving offline page');
    const offlinePage = await caches.match('./offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    
    // Final fallback
    return new Response('Offline - Please check your connection', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// ============================================
// STRATEGY: Static Assets (Stale-While-Revalidate)
// ============================================
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);

  // Return cached version immediately (stale)
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      caches.open(STATIC_CACHE).then((cache) => {
        cache.put(request, networkResponse.clone());
      });
    }
    return networkResponse;
  }).catch(() => {
    console.log('[SW] Static asset fetch failed, using cache');
  });

  // Return cached or wait for network
  return cachedResponse || fetchPromise;
}

// ============================================
// STRATEGY: Images (Cache First → Network)
// ============================================
async function handleImage(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());

      // Clean up old images if cache is too large
      cleanCache(IMAGE_CACHE, MAX_IMAGE_ITEMS);

      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Image fetch failed');
  }

  // Return placeholder or error
  return new Response('Image not available offline', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// ============================================
// STRATEGY: Fonts (Cache First → Network)
// ============================================
async function handleFont(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(FONT_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Font fetch failed');
  }

  // Return system font fallback
  return new Response('Font not available', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// ============================================
// STRATEGY: Dynamic Content (Network First → Cache)
// ============================================
async function handleDynamic(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());

      // Clean up old dynamic entries
      cleanCache(DYNAMIC_CACHE, MAX_DYNAMIC_ITEMS);

      return networkResponse;
    }

    throw new Error('Network response not ok');
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// ============================================
// STRATEGY: JavaScript Modules (Cache First)
// ============================================
async function handleJSModule(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Return cached immediately, update in background
    fetch(request).then(networkResponse => {
      if (networkResponse.ok) {
        caches.open(JS_MODULE_CACHE).then(cache => {
          cache.put(request, networkResponse);
        });
      }
    }).catch(() => {});
    
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(JS_MODULE_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] JS module fetch failed');
  }

  return new Response('Module not available', {
    status: 503,
    headers: { 'Content-Type': 'application/javascript' }
  });
}

// ============================================
// CACHE CLEANUP — Remove oldest entries
// ============================================
async function cleanCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    const itemsToDelete = keys.length - maxItems;
    const deletePromises = keys.slice(0, itemsToDelete).map((request) => {
      return cache.delete(request);
    });

    await Promise.all(deletePromises);
    console.log(`[SW] Cleaned ${itemsToDelete} items from ${cacheName}`);
  }
}

// ============================================
// REQUEST TYPE DETECTORS
// ============================================

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.headers.get('accept') || '').includes('text/html');
}

function isImageRequest(request, url) {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];
  const imageTypes = ['image/'];

  return imageExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext)) ||
         imageTypes.some(type => (request.headers.get('accept') || '').includes(type));
}

function isFontRequest(request, url) {
  const fontExtensions = ['.woff', '.woff2', '.ttf', '.otf', '.eot'];
  const fontTypes = ['font/'];

  return fontExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext)) ||
         fontTypes.some(type => (request.headers.get('accept') || '').includes(type));
}

function isStaticAsset(request, url) {
  const staticExtensions = ['.css', '.js', '.json', '.html'];
  const isLocal = url.origin === self.location.origin;

  return isLocal && staticExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
}

function isJSModule(request, url) {
  return url.pathname.endsWith('.js') || 
         url.pathname.includes('/js/modules/');
}

// ============================================
// BACKGROUND SYNC
// ============================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  // Sync user progress when back online
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'SYNC_COMPLETE',
      message: 'Your progress has been synced!'
    });
  });
}

// ============================================
// PUSH NOTIFICATIONS (Future Use)
// ============================================
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Time to practice your grammar!',
    icon: './icon.svg',
    badge: './icon.svg',
    tag: data.tag || 'grammar-reminder',
    requireInteraction: data.requireInteraction || false,
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'English Grammar Master',
      options
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      self.clients.openWindow('./')
    );
  }
});

// ============================================
// MESSAGE HANDLING (App ↔ SW Communication)
// ============================================
self.addEventListener('message', (event) => {
  const { data } = event;

  if (!data) return;

  switch (data.type || data) {
    case 'SKIP_WAITING':
      console.log('[SW] Skip waiting requested');
      self.skipWaiting();
      break;

    case 'GET_VERSION':
      event.ports[0]?.postMessage({
        version: CACHE_VERSION,
        timestamp: new Date().toISOString()
      });
      break;

    case 'CLEAR_CACHE':
      event.waitUntil(
        caches.keys().then((names) => {
          return Promise.all(names.map((name) => caches.delete(name)));
        }).then(() => {
          event.ports[0]?.postMessage({ success: true });
        })
      );
      break;

    case 'CHECK_UPDATE':
      event.waitUntil(
        self.registration.update().then(() => {
          event.ports[0]?.postMessage({ 
            updated: true,
            version: CACHE_VERSION 
          });
        })
      );
      break;

    default:
      console.log('[SW] Unknown message:', data);
  }
});

// ============================================
// PERIODIC SYNC (Daily Content Refresh)
// ============================================
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-content') {
    console.log('[SW] Periodic sync: daily content refresh');
    event.waitUntil(refreshContent());
  }
});

async function refreshContent() {
  // Refresh cached content periodically
  const cache = await caches.open(STATIC_CACHE);

  for (const url of APP_SHELL) {
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.log(`[SW] Failed to refresh: ${url}`);
    }
  }

  console.log('[SW] Content refresh complete');
}

// ============================================
// ERROR HANDLING
// ============================================
self.addEventListener('error', (event) => {
  console.error('[SW] Error:', event.message);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled rejection:', event.reason);
});

console.log('[SW] Service Worker loaded:', CACHE_VERSION);