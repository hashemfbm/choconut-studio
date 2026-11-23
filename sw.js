'use strict';

const scope = new URL(self.registration.scope);
const prefix = `choconut-studio:${scope.pathname}:`;
const cacheName = prefix + '2026-11-23-2';
const entry = new URL('index.html',scope);
const assets = [
  entry.href,
  ...['manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png']
    .map(path => new URL(path,scope).href),
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName)
    .then(cache => cache.addAll(assets.map(url => new Request(url,{cache:'reload',redirect:'error'}))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith(prefix) && key !== cacheName).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

async function appNavigation(request,url) {
  let response;
  try { response = await fetch(request); }
  catch {
    const cached = await caches.open(cacheName).then(cache => cache.match(entry.href)).catch(() => undefined);
    return cached || Response.error();
  }
  const samePage = !url.search && response.url && new URL(response.url).origin === scope.origin && !response.redirected;
  if (samePage && response.status === 200 && /^text\/html\b/i.test(response.headers.get('Content-Type') || '')) {
    const copy = response.clone();
    await caches.open(cacheName).then(cache => cache.put(entry.href,copy)).catch(() => undefined);
  }
  return response;
}

async function staticAsset(request) {
  const cached = await caches.open(cacheName).then(cache => cache.match(request)).catch(() => undefined);
  return cached || fetch(request);
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== scope.origin) return;
  if (request.mode === 'navigate' && (url.pathname === scope.pathname || url.pathname === entry.pathname)) {
    event.respondWith(appNavigation(request,url));
  } else if (assets.includes(request.url)) {
    event.respondWith(staticAsset(request));
  }
});
