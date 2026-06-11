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

        id:Date.now(),

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

    div.id = data.id;

    const myName =
    localStorage.getItem("chat-name");

    if(data.name === myName){

        div.classList.add("my-message");

    }

    const time =
    new Date().toLocaleTimeString();

    div.innerHTML = `

        <b>${data.name}</b><br>

        <span class="msg-text">
            ${data.message}
        </span>

        <div class="time">
            ${time}
        </div>

        <button
        class="edit-btn"
        onclick="editMessage('${data.id}')">

            Edit

        </button>

    `;

    messages.appendChild(div);

    messages.scrollTop =
    messages.scrollHeight;

});

/* EDIT */

function editMessage(id){

    const box =
    document.getElementById(id);

    const text =
    box.querySelector(".msg-text");

    const oldText =
    text.innerText;

    const newText =
    prompt("Edit Message", oldText);

    if(newText){

        text.innerText = newText;

    }

}

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