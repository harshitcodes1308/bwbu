// Offline runtime cache. Deliberately conservative: it must NEVER turn a
// transient network hiccup into a broken page, and it leaves API calls and
// Next.js dev/HMR/RSC traffic entirely to the browser.
// ponytail: runtime cache only, no precache/versioned shell.
const CACHE = "mr-runtime-v2";

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
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Never intercept API calls or Next.js dev/HMR — the network owns these.
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/webpack-hmr")) return;

  if (req.mode === "navigate") { e.respondWith(navHandler(req)); return; }

  // Cache-first only for static assets; everything else is left to the browser.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/images/") || url.pathname === "/manifest.webmanifest") {
    e.respondWith(cacheFirst(req));
  }
});

// Navigations: network-first, but on failure fall back to any cached page and,
// as a last resort, a tiny offline notice — never a rejected promise.
async function navHandler(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (
      (await cache.match(req)) ||
      (await cache.match("/home")) ||
      (await cache.match("/")) ||
      new Response("<!doctype html><meta charset=utf-8><h1>ऑफ़लाइन</h1>", {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      })
    );
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (await cache.match(req)) || Response.error();
  }
}
