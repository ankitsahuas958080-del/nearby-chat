const socket = io();

const nameInput = document.getElementById("name");

const messageInput = document.getElementById("message");

const messages = document.getElementById("messages");

const onlineCount = document.getElementById("online-count");

/* SEND MESSAGE */

function sendMessage(){

    const name = nameInput.value.trim();

    const message = messageInput.value.trim();

    if(name === "" || message === ""){
        return;
    }

    socket.emit("send-message", {

        name,
        message

    });

    messageInput.value = "";

}

/* RECEIVE MESSAGE */

socket.on("receive-message", (data) => {

    const div = document.createElement("div");

    div.classList.add("message");

    div.innerHTML = `

        <strong>${data.name}</strong><br>

        ${data.message}

    `;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;

});

/* ONLINE USERS */

socket.on("online-users", (count) => {

    onlineCount.innerText =
    `🟢 Online Users: ${count}`;

});

/* ENTER KEY */

messageInput.addEventListener("keypress", (e) => {

    if(e.key === "Enter"){

        sendMessage();

    }

});