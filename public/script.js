const socket = io();

const messages = document.getElementById("messages");
const input = document.getElementById("message");
const nameInput = document.getElementById("name");
const onlineUsers = document.getElementById("onlineUsers");

function sendMessage() {

    const message = input.value.trim();
    const name = nameInput.value.trim();

    if(message === "" || name === "") return;

    const data = {
        id: Date.now(),
        name: name,
        message: message,
        time: new Date().toLocaleTimeString(),
        sender: socket.id
    };

    socket.emit("send-message", data);

    input.value = "";
}

socket.on("receive-message", (data) => {

    const div = document.createElement("div");

    if(data.sender === socket.id){
        div.className = "my-message";
    } else {
        div.className = "other-message";
    }

    div.id = data.id;

    let editButton = "";

    if(data.sender === socket.id){

        editButton = `
            <button onclick="editMessage('${data.id}')">
                Edit
            </button>
        `;
    }

    div.innerHTML = `
        <h3>${data.name}</h3>
        <p class="text">${data.message}</p>
        <small>${data.time}</small>
        ${editButton}
    `;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;
});

function editMessage(id){

    const box = document.getElementById(id);

    const text = box.querySelector(".text");

    const newText = prompt("Edit message", text.innerText);

    if(newText){

        text.innerText = newText;

        socket.emit("edit-message", {
            id: id,
            newMessage: newText
        });

    }

}

socket.on("message-edited", (data)=>{

    const box = document.getElementById(data.id);

    if(box){

        box.querySelector(".text").innerText = data.newMessage;

    }

});

socket.on("online-users", (count)=>{

    onlineUsers.innerText = count;

});

input.addEventListener("keypress", (e)=>{

    if(e.key === "Enter"){
        sendMessage();
    }

});
if(data.sender === socket.id){
    div.className = "my-message";
} else {
    div.className = "other-message";
}