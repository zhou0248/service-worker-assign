document.addEventListener("DOMContentLoaded", () => {
  //register the service worker and add message event listener
  //listen for navigation popstate event
  //get the data for the page
  //add click listener to #cards
  if ("serviceWorker" in navigator) {
    registerSW();
  } else {
    console.log("Service Worker not supported");
  }

  navigator.serviceWorker.addEventListener("message", receiveMessageFromSW);

  getData();

  document.getElementById("cards").addEventListener("click", handleCardClicks);

  window.addEventListener("popstate", (ev) => {
    // console.log("Popstate event: ", ev);
  });
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
  caches.match("users.json").then((cachedResponse) => {
    if (cachedResponse) {
      // console.log("Found users.json in cache", cachedResponse);
      return cachedResponse.json().then((data) => {
        // console.log("Display user data from cache");
        showCards(data);
      });
    } else {
      fetch(url, { method: "GET", credentials: "omit" })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok`);
          }
          // console.log("Fetch made from main.js", response);
          return response.json();
        })
        .then((data) => {
          showCards(data);
        })
        .catch((err) => {
          console.error("Fetch Error from main.js", err);
        });
    }
  });
}
function handleCardClicks() {
  const cards = document.querySelectorAll("#cards .card");
  cards.forEach((card) => {
    card.addEventListener("click", (ev) => {
      const uid = ev.currentTarget.dataset.uid;
      // console.log("Card clicked: ", uid);
      changeURL(uid);
      // send message to SW
      let msg = { uid: uid, func: "changeURL" };
      sendMessageToSW(msg);
      return uid;
    });
  });
}

function showCards(data) {
  userList.innerHTML = "";
  const cards = data.map((user) => createCard(user));
  userList.append(...cards);
}

function createCard(user) {
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
  return card;
}

function sendMessageToSW(msg) {
  navigator.serviceWorker.ready.then((reg) => {
    reg.active.postMessage(msg);
  });
}

function receiveMessageFromSW(ev) {
  //ev.data.func ev.data.uid
  if ("func" in ev.data) {
    if (typeof eval(ev.data.func) === "function") {
      let f = eval(ev.data.func);
      f(ev.data.uid);
    }
  }
}

function changeURL(uid) {
  let url = location.origin + `/index.html#${uid}`;
  location.assign(url);
}

function changeColor() {
  const cards = document.querySelectorAll("#cards .card");
  cards.forEach((card) => {
    card.style.backgroundColor = "green";
  });
}

function hideOtherCards(uid) {
  const cards = document.querySelectorAll("#cards .card");
  cards.forEach((card) => {
    if (card.dataset.uid !== uid) {
      card.classList.add("hidden");
    }
  });
}
