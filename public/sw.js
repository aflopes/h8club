// Service Worker for H8CLUB
// This is a minimal service worker for static asset caching

const CACHE_NAME = "h8club-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Network-first strategy for API calls, cache-first for static assets
  if (event.request.url.includes("/api/") || event.request.url.includes("supabase.co")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response("Offline", { status: 503 });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
