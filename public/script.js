const socket = io();

const messages = document.getElementById("messages");
const input = document.getElementById("message");
const nameInput = document.getElementById("name");
const onlineUsers = document.getElementById("onlineUsers");

let myName = "";

function sendMessage() {

    const message = input.value;

    if(message.trim() === "") return;

    myName = nameInput.value;

    if(myName.trim() === "") {
        alert("Enter your name");
        return;
    }

    const data = {
        id: Date.now(),
        name: myName,
        message: message,
        time: new Date().toLocaleTimeString(),
        sender: socket.id
    };

    socket.emit("send-message", data);

    input.value = "";
}

socket.on("receive-message", (data) => {

    const div = document.createElement("div");

    // apna message right side
    if(data.sender === socket.id){
        div.classList.add("my-message");
    } else {
        div.classList.add("other-message");
    }

    div.id = data.id;

    let editButton = "";

    // sirf apne message pe edit button
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

    const textElement = box.querySelector(".text");

    const oldText = textElement.innerText;

    const newText = prompt("Edit message", oldText);

    if(newText){

        textElement.innerText = newText;

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

input.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        sendMessage();
    }

});