// १. इन्स्टल गर्दा कुनै पनि फाइल खोजेर अल्झिने छैन
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// २. तुरुन्तै सर्भिस वर्कर सक्रिय हुनेछ
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// ३. सामान्य नेटवर्क रिक्वेस्ट (अहिले क्यासको झन्झट छैन)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
