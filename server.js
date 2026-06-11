const express = require("express");
const app = express();

const http = require("http").createServer(app);

const io = require("socket.io")(http);

app.use(express.static("public"));

let onlineUsers = 0;

io.on("connection", (socket) => {

    // user connected
    onlineUsers++;

    io.emit("online-users", onlineUsers);

    // send message
    socket.on("send-message", (data) => {

        io.emit("receive-message", data);

    });

    // edit message
    socket.on("edit-message", (data) => {

        io.emit("message-edited", data);

    });

    // disconnect
    socket.on("disconnect", () => {

        onlineUsers--;

        io.emit("online-users", onlineUsers);

    });

});

http.listen(3000, "0.0.0.0", () => {

    console.log("Running");

});