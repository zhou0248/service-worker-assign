document.addEventListener("DOMContentLoaded", () => {
  //register the service worker and add message event listener
  //listen for navigation popstate event
  //get the data for the page
  //add click listener to #cards
  if ("serviceWorker" in navigator) {
    registerSW();
  }
  window.addEventListener("popstate", () => {});
  getData();
  handleCardClicks();
});

const userList = document.getElementById("cards");

function registerSW() {
  navigator.serviceWorker.register("./sw.js").then((reg) => {
    console.log("Service Worker registered");
  });
}

function getData() {
  let size = 20;
  const url = `https://random-data-api.com/api/v2/users?size=${size}`;
  fetch(url, { method: "GET", credentials: "omit" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok`);
      }
      return response.json();
    })
    .then((data) => {
      userList.innerHTML = "";
      data.forEach((user) => {
        showCards(user);
      });
    })
    .catch((err) => {
      console.error("Fetching Error from main.js", err);
    });
}

function handleCardClicks() {}

function showCards(user) {
  const card = document.createElement("li");
  card.classList.add("card");
  card.dataset.uid = user.uid;
  card.innerHTML = `
    <img src="${user.avatar}" alt="${user.username}" />
    <div>
      <h3>${user.username}</h3>
      <p>${user.email}</p>
    </div>
  `;
  userList.appendChild(card);
}

function sendMessageToSW(uid, action) {
  navigator.serviceWorker.controller.postMessage({ uid: uid, action: action });
}

function receiveMessageFromSW(ev) {}
