const socket = io();

const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const messages = document.getElementById("messages");
const onlineUsers = document.getElementById("onlineUsers");

function sendMessage(){

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if(name === "" || message === ""){
        return;
    }

    const data = {

        id: Date.now(),

        sender: socket.id,

        name: name,

        message: message,

        time: new Date().toLocaleTimeString()

    };

    socket.emit("send-message", data);

    messageInput.value = "";

}

socket.on("receive-message", (data)=>{

    const div = document.createElement("div");

    if(data.sender === socket.id){

        div.className = "my-message";

    }else{

        div.className = "other-message";

    }

    div.innerHTML = `

        <div class="name">${data.name}</div>

        <div>${data.message}</div>

        <div class="time">${data.time}</div>

    `;

    if(data.sender === socket.id){

        const editBtn = document.createElement("button");

        editBtn.innerText = "Edit";

        editBtn.className = "edit-btn";

        editBtn.onclick = ()=>{

            const newMessage = prompt("Edit message", data.message);

            if(newMessage){

                data.message = newMessage;

                socket.emit("edit-message", data);

            }

        };

        div.appendChild(editBtn);

    }

    div.setAttribute("data-id", data.id);

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;

});

socket.on("message-edited", (data)=>{

    const allMessages = document.querySelectorAll("[data-id]");

    allMessages.forEach((msg)=>{

        if(msg.getAttribute("data-id") == data.id){

            msg.innerHTML = `

                <div class="name">${data.name}</div>

                <div>${data.message}</div>

                <div class="time">${data.time} (edited)</div>

            `;

            if(data.sender === socket.id){

                const editBtn = document.createElement("button");

                editBtn.innerText = "Edit";

                editBtn.className = "edit-btn";

                editBtn.onclick = ()=>{

                    const newMessage = prompt("Edit message", data.message);

                    if(newMessage){

                        data.message = newMessage;

                        socket.emit("edit-message", data);

                    }

                };

                msg.appendChild(editBtn);

            }

        }

    });

});

socket.on("online-users", (count)=>{

    onlineUsers.innerText = count;

});

messageInput.addEventListener("keypress", (e)=>{

    if(e.key === "Enter"){

        sendMessage();

    }

});