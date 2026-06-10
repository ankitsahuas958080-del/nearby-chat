const socket = io();

const nameInput =
document.getElementById("name");

const savedName =
localStorage.getItem("chat-name");

if(savedName){

    nameInput.value = savedName;

}

function sendMessage(){

    const name =
    document.getElementById("name").value;

    const message =
    document.getElementById("message").value;

    if(name === "" || message === ""){
        return;
    }

    localStorage.setItem(
        "chat-name",
        name
    );

    socket.emit("send-message", {

        name:name,

        message:message

    });

    document.getElementById("message").value = "";

}

socket.on("receive-message", (data)=>{

    const messages =
    document.getElementById("messages");

    const div =
    document.createElement("div");

    div.classList.add("message");

    const time =
    new Date().toLocaleTimeString();

    div.innerHTML =

    "<b>" + data.name + "</b><br>" +

    data.message +

    "<br><small>" + time + "</small>";

    messages.appendChild(div);

    messages.scrollTop =
    messages.scrollHeight;

});