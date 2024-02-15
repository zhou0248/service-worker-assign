document.addEventListener("DOMContentLoaded", () => {
  //register the service worker and add message event listener
  //listen for navigation popstate event
  //get the data for the page
  //add click listener to #cards
  window.addEventListener("popstate", () => {});
  getData();
  handleCardClicks();
});

function registerSW() {}

function getData() {
  const url = "https://random-data-api.com/api/v2/users?size=20";
  fetch(url)
    .then((response) => {
    if (!repsonse.ok) {
      throw new Error ("Network response was not ok");
    }
    return response.json();
  });
    .then ((data) => {cardList.innerHTML = "";
    data.forEach((user) => {showCards(user);});})
}

function handleCardClicks() {
  document.querySelector("#cards").addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (li){
      const uid = li.dataset.uid;
location.href = `index.html#${uid}`;
    }
    }
  )};

function showCards() {
  const carList = document.querySelector("#cards");
  cardList.innerHTML = "";
  // create teh card elements
  cardList.innerHTML = `<li data-uid="${user.id}">
  <img src="${user.avatar}" alt="${user.first_name} ${user.last_name}" />
  <h2> ${user.first_name} ${user.last_name}</h2>
  <p>${user.email}</p>
  <li>`;
}

function sendMessageToSW() {}

function receiveMessageFromSW() {}

function urlBar(ev){
  ev.preventDefault();
  let hash = location.hash.slice(1);
  if (hash === "") {getData();return;}
  console.log(hash);
}
users.find((user)=> {if (user.uid === hash) console.log(user); cardList.innerHTML =""; showCards(user);});