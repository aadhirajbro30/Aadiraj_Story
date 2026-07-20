// क्यासको नाम र भर्सन (भविष्यमा केही परिवर्तन गरेमा v1 लाई v2 बनाउनुहोस्)
const CACHE_NAME = 'aadhiraj-story-v1';

// अफलाइनमा पनि चलाउनका लागि सेभ (Cache) गरिने फाइलहरूको सूची
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './home.html',
  './style.css',
  './manifest.json',
  './new-logo.png',
  './Snickles.ttf',
  './hindi-story.html',
  './nepali-story.html'
];

// १. इन्स्टल हुँदा फाइलहरू क्यास (Cache) गर्ने
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting()) // तुरुन्तै नयाँ सर्भिस वर्कर सक्रिय गराउने
  );
});

// २. एक्टिभेट हुँदा पुराना क्यासहरू हटाउने (यदि भर्सन फेरियो भने)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ३. नेटवर्क अनुरोध आउँदा: पहिले क्यास खोज्ने, भेटिएन भने मात्र इन्टरनेटबाट ल्याउने
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // क्यासबाटै दिने (अफलाइन चल्छ)
      }
      return fetch(event.request).catch(() => {
        // यदि इन्टरनेट पनि छैन र क्यासमा पनि छैन भने मुख्य पेजमा फर्काइदिने
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

