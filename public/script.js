const socket = io();

const nameInput =
document.getElementById("name");

const messageInput =
document.getElementById("message");

const messages =
document.getElementById("messages");

const onlineCount =
document.getElementById("online-count");

/* SAVE NAME */

if(localStorage.getItem("chat-name")){

    nameInput.value =
    localStorage.getItem("chat-name");

}

/* SAVE WHILE TYPING */

nameInput.addEventListener("input", ()=>{

    localStorage.setItem(
        "chat-name",
        nameInput.value
    );

});

/* SEND MESSAGE */

function sendMessage(){

    const name =
    nameInput.value.trim();

    const message =
    messageInput.value.trim();

    if(name === "" || message === ""){
        return;
    }

    socket.emit("send-message", {

        name:name,

        message:message

    });

    messageInput.value = "";

}

/* RECEIVE MESSAGE */

socket.on("receive-message", (data)=>{

    const div =
    document.createElement("div");

    div.classList.add("message-box");

    const time =
    new Date().toLocaleTimeString();

    div.innerHTML = `

        <b>${data.name}</b><br>

        ${data.message}

        <div class="time">
            ${time}
        </div>

    `;

    messages.appendChild(div);

    messages.scrollTop =
    messages.scrollHeight;

});

/* ONLINE USERS */

socket.on("online-users", (count)=>{

    onlineCount.innerText = count;

});

/* ENTER KEY */

messageInput.addEventListener("keypress", (e)=>{

    if(e.key === "Enter"){

        sendMessage();

    }

});