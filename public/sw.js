// Caches the clinic desk so a phone can open it again without internet.
const CACHE = 'sri-rudra-desk-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([
    './',
    './index.html',
    './desk.html',
    './desk.webmanifest',
    './clinic-logo-mobile.png',
  ]).catch(() => undefined)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

function isDeskAsset(url) {
  const path = url.pathname;
  return path.endsWith('/desk.html')
    || path.endsWith('/index.html')
    || path.endsWith('/desk')
    || path.endsWith('/desk/')
    || path.endsWith('/sw.js')
    || path.endsWith('/desk.webmanifest')
    || path.endsWith('/clinic-logo-mobile.png')
    || path.includes('/assets/');
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !isDeskAsset(url)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const fresh = await fetch(request);
      if (fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return (await cache.match('./index.html'))
          || (await cache.match('./desk.html'))
          || (await cache.match('/desk.html'))
          || Response.error();
      }
      return Response.error();
    }
  })());
});
