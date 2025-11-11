const CACHE = 'magic-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e)=>{
  const {request} = e;
  e.respondWith(
    caches.match(request).then(cached => 
      cached || fetch(request).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(request, copy));
        return res;
      }).catch(()=>cached)
    )
  );
});
