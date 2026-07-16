const CACHE = 'starlight-v7';

// HTML 파일은 캐시하지 않음 (항상 최신 버전)
const HTML_FILES = [
  '/',
  '/index.html',
  '/members.html',
  '/game.html',
  '/jihye.html',
];

// 이미지 등 정적 파일만 캐시
const STATIC_ASSETS = [
  '/exterior.jpg',
  '/map.jpg',
  '/lobby.jpg',
  '/floor1.jpg',
  '/floor2.jpg',
  '/floor3.jpg',
  '/B1.jpg',
  '/rooftop.jpg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isHTML = HTML_FILES.some(p => url.pathname === p || url.pathname === p + '/')
    || url.pathname.endsWith('.html');

  if (isHTML) {
    // HTML은 네트워크 우선 — 항상 최신 버전 가져오기
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    // 이미지 등 정적 파일은 캐시 우선
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
