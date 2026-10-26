/* =====================================================
SECRET CRUSH — SERVICE WORKER
Caches the app shell so the app opens offline and can be
installed. Network-first, so edits you deploy show up
immediately while online. Does not handle push yet.
===================================================== */
const CACHE_VERSION = "secret-crush-v1";

const APP_SHELL = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches
            .open(CACHE_VERSION)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches
            .keys()
            .then(keys =>
                Promise.all(
                    keys
                        .filter(
                            key =>
                                key.startsWith("secret-crush-") &&
                                key !== CACHE_VERSION
                        )
                        .map(key => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;

    /* Only cache simple page/file reads. */
    if (request.method !== "GET") return;

    const url = new URL(request.url);

    /* Leave other websites (images, fonts) and your future
       backend calls to the browser. */
    if (url.origin !== self.location.origin) return;
    if (url.pathname.startsWith("/api/")) return;

    event.respondWith(networkFirst(request));
});

async function networkFirst(request) {
    const cache = await caches.open(CACHE_VERSION);

    try {
        const fresh = await fetch(request);
        if (fresh && fresh.status === 200) {
            cache.put(request, fresh.clone());
        }
        return fresh;
    } catch (error) {
        const cached = await cache.match(request, { ignoreSearch: true });
        if (cached) return cached;

        if (request.mode === "navigate") {
            const shell = await cache.match("./index.html");
            if (shell) return shell;
        }
        return Response.error();
    }
}