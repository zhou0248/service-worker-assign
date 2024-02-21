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

  // window.addEventListener(
  //   "popstate",
  //   (ev) => {
  //     const uid = location.hash.slice(1);
  //     if (uid) {
  //       changeURL(uid);
  //       console.log("URL changed by popstate event");
  //     }
  //   }
  //   // console.log("Popstate event: ", ev);
  // );
  // causes Uncaught RangeError: Maximum call stack size exceeded.
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
      // console.log("url changed by service worker");

      const color = pickAColor();
      let msg2 = { color: color, func: "changeColor" };
      sendMessageToSW(msg2);
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
  if ("func" in ev.data && "uid" in ev.data) {
    callFunc(ev.data.func, ev.data.uid);
  } else if ("func" in ev.data && "color" in ev.data) {
    callFunc(ev.data.func, ev.data.color);
  }
}

function callFunc(funcName, arg) {
  if (typeof eval(funcName) === "function") {
    let f = eval(funcName);
    f(arg);
  }
}

function changeURL(uid) {
  let url = location.origin + `/index.html#${uid}`;
  location.assign(url);
}

function changeColor(pickedColor) {
  const headline = document.querySelector("h1");
  headline.style.color = pickedColor;
}

function pickAColor() {
  let pickedColor = "#" + Math.random().toString(16).substring(2, 8);
  return pickedColor;
}
// reference https://www.youtube.com/watch?v=6wNt8B8aH80

function hideOtherCards(uid) {
  const cards = document.querySelectorAll("#cards .card");
  cards.forEach((card) => {
    if (card.dataset.uid !== uid) {
      card.classList.add("hidden");
    }
  });
}
