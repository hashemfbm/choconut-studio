'use strict';

const PREFIX = 'choconut-studio-';
const CACHE = PREFIX + '2026-11-23-1';
const entry = new URL('index.html', self.registration.scope).href;
const assets = [
  entry,
  ...['manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png']
    .map(path => new URL(path,self.registration.scope).href),
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(assets.map(url => new Request(url,{cache:'reload'}))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  const url = new URL(request.url);
  const start = new URL(self.registration.scope);
  if (request.mode === 'navigate' && (url.pathname === start.pathname || url.pathname === new URL(entry).pathname)) {
    event.respondWith(fetch(request).then(async response => {
      if (response.ok) {
        const cache = await caches.open(CACHE);
        await cache.put(entry,response.clone());
      }
      return response;
    }).catch(async () => (await caches.open(CACHE)).match(entry)));
  } else if (assets.includes(request.url)) {
    event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(request)) || fetch(request)));
  }
});
