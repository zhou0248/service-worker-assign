const version = "1";
const cacheName = `Aiting-${version}`;
const staticItems = ["./css/main.css", "./js/main.js", "./index.html"];

self.addEventListener("install", (ev) => {
  //cache static files, if needed
  ev.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(staticItems);
    })
  );
});

self.addEventListener("activate", (ev) => {
  //clear old caches, if desired
  ev.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", (ev) => {
  //handle all fetch requests
  const request = ev.request;
  const url = new URL(request.url);
  let isUserData = url.origin.includes("random-data-api.com");
  let isStatic =
    url.pathname.includes(".css") ||
    url.pathname.includes(".js") ||
    url.pathname.includes(".html");
  console.log(`fetch request for ${url}, ${isStatic}`);
  if (isStatic) {
    ev.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request);
      })
    );
  } else if (isUserData) {
    ev.respondWith(
      fetch(url, { method: "GET", credentials: "omit" }).catch(return404)
    );
  } else {
    ev.respondWith(fetch(request).catch(return404));
  }
});

self.addEventListener("message", (ev) => {
  //listen for messages from the main thread
});

function sendMessageToMain() {
  //send a message to the main threads of all clients
}

function return404(err) {
  return new Response(null, { status: 404 });
}
