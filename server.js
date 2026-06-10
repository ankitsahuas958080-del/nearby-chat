const express = require("express");

const app = express();

const http = require("http").createServer(app);

const io = require("socket.io")(http);

/* PUBLIC FOLDER */

app.use(express.static("public"));

/* ONLINE USERS */

let users = new Set();

/* SOCKET CONNECTION */

io.on("connection", (socket) => {

    console.log("User Connected");

    /* USER JOIN */

    socket.on("join", (name) => {

        socket.username = name;

        users.add(name);

        io.emit("online-users", users.size);

    });

    /* SEND MESSAGE */

    socket.on("send-message", (data) => {

        io.emit("receive-message", data);

    });

    /* DISCONNECT */

    socket.on("disconnect", () => {

        console.log("User Disconnected");

        users.delete(socket.username);

        io.emit("online-users", users.size);

    });

});

/* SERVER */

http.listen(process.env.PORT || 3000, "0.0.0.0", () => {

    console.log("Server Running");

});