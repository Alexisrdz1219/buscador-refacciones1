const CACHE_NAME = "refacciones-v1";

const urlsToCache = [

    "/",
    "/index.html",

    "/movimientos.html",

    "/css/styles.css",

    "/js/pagJs/tampo/tampografia.js"

];

self.addEventListener("install", (event) => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then((cache) => {

            return cache.addAll(urlsToCache);

        })

    );

});

self.addEventListener("fetch", (event) => {

    event.respondWith(

        caches.match(event.request)

        .then((response) => {

            return response || fetch(event.request);

        })

    );

});