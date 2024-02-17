document.addEventListener("DOMContentLoaded", () => {
  //register the service worker and add message event listener
  //listen for navigation popstate event
  //get the data for the page
  //add click listener to #cards
  registerSW();
  window.addEventListener("popstate", () => {});
  getData();
  handleCardClicks();
});

function registerSW() {
  navigator.serviceWorker.register("./sw.js").then((reg) => {
    console.log("Service Worker registered");
  });
}

function getData() {}

function handleCardClicks() {}

function showCards() {}

function sendMessageToSW(uid, action) {
  navigator.serviceWorker.controller.postMessage({ uid: uid, action: action });
}

function receiveMessageFromSW(ev) {}
