// Network-first runtime cache: rural users lose signal mid-task, so a screen
// already seen stays readable offline. POST /api/* is never cached (nothing to
// cache, and the routes already have offline templates); cross-origin (fonts
// CDN) is left to the browser.
// ponytail: runtime cache only, no precache/versioned shell — add a build-time
// precache manifest if the offline shell ever needs to be guaranteed complete.
const CACHE = "mr-runtime-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return; // POSTs (OTP, AI) hit the network
  if (new URL(request.url).origin !== self.location.origin) return; // fonts etc.
  e.respondWith(networkFirst(request));
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(request);
    if (res && res.ok) cache.put(request, res.clone());
    return res;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") {
      const shell = (await cache.match("/home")) || (await cache.match("/"));
      if (shell) return shell;
    }
    throw err;
  }
}
