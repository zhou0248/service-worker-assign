const version = "1";
const cacheName = `Aiting-${version}`;
const cacheItems = ["./css/main.css", "./js/main.js", "./index.html"];

self.addEventListener("install", (ev) => {
  //cache static files, if needed
  ev.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheItems);
    })
  );
});
self.addEventListener("activate", (ev) => {
  //clear old caches, if desired
  ev.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((nm) => nm !== cacheName).map((nm) => caches.delete(nm))
      );
    })
  );
});
self.addEventListener("fetch", (ev) => {
  //handle all fetch requests
});
self.addEventListener("message", (ev) => {
  //listen for messages from the main thread
});

function sendMessageToMain() {
  //send a message to the main threads of all clients
}
