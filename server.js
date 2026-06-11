const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

let users = 0;

io.on("connection", (socket) => {

    users++;

    io.emit("online-users", users);

    socket.on("send-message", (data) => {

        io.emit("receive-message", data);

    });

    socket.on("edit-message", (data) => {

        io.emit("message-edited", data);

    });

    socket.on("disconnect", () => {

        users--;

        io.emit("online-users", users);

    });

});

server.listen(3000, "0.0.0.0", () => {

    console.log("Running");

});