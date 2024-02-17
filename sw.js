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
});

self.addEventListener("message", (ev) => {
  //listen for messages from the main thread
});

function sendMessageToMain() {
  //send a message to the main threads of all clients
}
