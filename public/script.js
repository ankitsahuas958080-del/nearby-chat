// ==========================
// SOCKET CONNECTION
// ==========================

const socket = io();

// ==========================
// ELEMENTS
// ==========================

const setupScreen = document.getElementById("setupScreen");
const chatScreen = document.getElementById("chatScreen");

const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("startBtn");

const avatar = document.getElementById("avatar");
const myProfile = document.getElementById("myProfile");

const colors = document.querySelectorAll(".color");

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const chatArea = document.getElementById("chatArea");

const onlineCount = document.getElementById("onlineCount");

const typingBox = document.getElementById("typingBox");

const menuBtn = document.getElementById("menuBtn");
const menuOverlay = document.getElementById("menuOverlay");
const closeMenu = document.getElementById("closeMenu");

const themeBtn = document.getElementById("themeBtn");

const replyBox = document.getElementById("replyBox");
const closeReply = document.getElementById("closeReply");

const editOverlay = document.getElementById("editOverlay");

const imageBtn = document.querySelector(".image-btn");

// ==========================
// USER DATA
// ==========================

let username = "";
let userColor = "#7c5cff";

let replyTo = null;

// ==========================
// COLOR SELECT
// ==========================

colors.forEach(color => {

  color.addEventListener("click", () => {

    colors.forEach(c => c.classList.remove("active"));

    color.classList.add("active");

    userColor = color.dataset.color;

    avatar.style.background = userColor;

    myProfile.style.background = userColor;

  });

});

// ==========================
// USERNAME INPUT
// ==========================

usernameInput.addEventListener("input", () => {

  let value = usernameInput.value.trim();

  if(value.length > 0){

    avatar.innerText = value[0].toUpperCase();

  }else{

    avatar.innerText = "A";

  }

});

// ==========================
// START CHAT
// ==========================

startBtn.addEventListener("click", () => {

  username = usernameInput.value.trim();

  if(username === ""){

    alert("Enter your name");

    return;

  }

  // SAVE LOCAL

  localStorage.setItem("chatName", username);
  localStorage.setItem("chatColor", userColor);

  // PROFILE

  myProfile.innerText = username[0].toUpperCase();

  myProfile.style.background = userColor;

  // SCREEN SWITCH

  setupScreen.classList.remove("active");

  chatScreen.classList.add("active");

  // JOIN SOCKET

  socket.emit("join-user", {
    name: username,
    color: userColor
  });

});

// ==========================
// AUTO LOGIN
// ==========================

window.addEventListener("load", () => {

  const savedName = localStorage.getItem("chatName");
  const savedColor = localStorage.getItem("chatColor");

  if(savedName){

    username = savedName;

    userColor = savedColor || "#7c5cff";

    myProfile.innerText = username[0].toUpperCase();

    myProfile.style.background = userColor;

    setupScreen.classList.remove("active");

    chatScreen.classList.add("active");

    socket.emit("join-user", {
      name: username,
      color: userColor
    });

  }

});

// ==========================
// SEND MESSAGE
// ==========================

function sendMessage(){

  const text = messageInput.value.trim();

  if(text === "") return;

  const messageData = {

    name: username,
    color: userColor,
    text: text,
    time: getTime(),
    reply: replyTo

  };

  socket.emit("send-message", messageData);

  messageInput.value = "";

  replyTo = null;

  replyBox.classList.add("hidden");

}

// ==========================
// BUTTON SEND
// ==========================

sendBtn.addEventListener("click", sendMessage);

// ==========================
// ENTER SEND
// ==========================

messageInput.addEventListener("keypress", (e) => {

  if(e.key === "Enter"){

    sendMessage();

  }

});

// ==========================
// RECEIVE MESSAGE
// ==========================

socket.on("receive-message", (data) => {

  createMessage(data);

});

// ==========================
// CREATE MESSAGE
// ==========================

function createMessage(data){

  const message = document.createElement("div");

  message.classList.add("message");

  // MY MESSAGE

  if(data.name === username){

    message.classList.add("you");

  }

  // REPLY HTML

  let replyHTML = "";

  if(data.reply){

    replyHTML = `
      <div class="reply-preview">
        ↩ ${data.reply}
      </div>
    `;

  }

  // OTHER USER

  if(data.name !== username){

    message.innerHTML = `

      <div class="msg-avatar"
        style="background:${data.color}">
        ${data.name[0].toUpperCase()}
      </div>

      <div class="bubble">

        <h4>${data.name}</h4>

        ${replyHTML}

        <p>${data.text}</p>

        <div class="msg-bottom">

          <span>${data.time}</span>

          <div class="reactions">
            😂
          </div>

        </div>

      </div>

    `;

  }else{

    // MY MESSAGE

    message.innerHTML = `

      <div class="bubble">

        ${replyHTML}

        <p>${data.text}</p>

        <div class="msg-bottom">

          <span>${data.time}</span>

          <span class="ticks">✓✓</span>

        </div>

      </div>

    `;

  }

  // LONG PRESS MENU

  message.addEventListener("contextmenu", (e) => {

    e.preventDefault();

    showMessageOptions(data.text);

  });

  // DOUBLE CLICK REPLY

  message.addEventListener("dblclick", () => {

    replyTo = data.text;

    replyBox.classList.remove("hidden");

    document.querySelector(".reply-text").innerText =
      "↩ Replying to " + data.name;

  });

  chatArea.appendChild(message);

  // AUTO SCROLL

  chatArea.scrollTop = chatArea.scrollHeight;

}

// ==========================
// MESSAGE OPTIONS
// ==========================

function showMessageOptions(text){

  const action = prompt(
    "Type:\nreply\nedit\ndelete"
  );

  if(action === "reply"){

    replyTo = text;

    replyBox.classList.remove("hidden");

  }

  if(action === "edit"){

    editOverlay.classList.remove("hidden");

    document.getElementById("editInput").value = text;

  }

  if(action === "delete"){

    alert("Delete feature frontend ready 😎");

  }

}

// ==========================
// CLOSE REPLY
// ==========================

closeReply.addEventListener("click", () => {

  replyTo = null;

  replyBox.classList.add("hidden");

});

// ==========================
// MENU OPEN
// ==========================

menuBtn.addEventListener("click", () => {

  menuOverlay.classList.remove("hidden");

});

// ==========================
// MENU CLOSE
// ==========================

closeMenu.addEventListener("click", () => {

  menuOverlay.classList.add("hidden");

});

// CLOSE CLICK OUTSIDE

menuOverlay.addEventListener("click", (e) => {

  if(e.target === menuOverlay){

    menuOverlay.classList.add("hidden");

  }

});

// ==========================
// DARK MODE
// ==========================

themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("light");

  if(document.body.classList.contains("light")){

    themeBtn.innerText = "☀️";

  }else{

    themeBtn.innerText = "🌙";

  }

});

// ==========================
// TYPING
// ==========================

let typingTimeout;

messageInput.addEventListener("input", () => {

  socket.emit("typing", username);

  clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {

    socket.emit("stop-typing");

  }, 1000);

});

// SHOW TYPING

socket.on("show-typing", (name) => {

  if(name !== username){

    typingBox.style.display = "flex";

    typingBox.querySelector("p").innerText =
      name + " typing...";

  }

});

// HIDE TYPING

socket.on("hide-typing", () => {

  typingBox.style.display = "none";

});

// ==========================
// ONLINE USERS
// ==========================

socket.on("online-users", (count) => {

  onlineCount.innerText =
    "🟢 " + count + " online nearby";

});

// ==========================
// IMAGE BUTTON
// ==========================

imageBtn.addEventListener("click", () => {

  alert("Image upload feature ready 📸");

});

// ==========================
// EDIT MODAL
// ==========================

document.querySelector(".cancel-btn")
.addEventListener("click", () => {

  editOverlay.classList.add("hidden");

});

document.querySelector(".save-btn")
.addEventListener("click", () => {

  alert("Message edited 😎");

  editOverlay.classList.add("hidden");

});

// ==========================
// TIME
// ==========================

function getTime(){

  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();

  minutes = minutes < 10
    ? "0" + minutes
    : minutes;

  return hours + ":" + minutes;

}