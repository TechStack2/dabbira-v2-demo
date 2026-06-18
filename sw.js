/* Dabbira V2 demo — minimal PWA service worker (network-first so the demo stays fresh, cache fallback for offline + installability) */
const CACHE = "dabbira-demo-v1";
const SHELL = [
  "./", "./index.html", "./journey-c1-conversational.html",
  "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: "reload" }))).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  e.respondWith(
    fetch(r).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(r, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(r))
  );
});
