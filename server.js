const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

let onlineUsers = 0;

io.on("connection", (socket)=>{

    onlineUsers++;

    io.emit("online-users", onlineUsers);

    socket.on("send-message", (data)=>{

        io.emit("receive-message", data);

    });

    socket.on("edit-message", (data)=>{

        io.emit("message-edited", data);

    });

    socket.on("disconnect", ()=>{

        onlineUsers--;

        io.emit("online-users", onlineUsers);

    });

});

server.listen(3000, "0.0.0.0", ()=>{

    console.log("Running");

});