const express = require("express");

const app = express();

const http = require("http").createServer(app);

const io = require("socket.io")(http);

app.use(express.static("public"));

/* ONLINE USERS */

let onlineUsers = 0;

/* CONNECTION */

io.on("connection", (socket) => {

    console.log("User Connected");

    onlineUsers++;

    io.emit("online-users", onlineUsers);

    /* MESSAGE */

    socket.on("send-message", (data) => {

        io.emit("receive-message", data);

    });

    /* DISCONNECT */

    socket.on("disconnect", () => {

        console.log("User Disconnected");

        onlineUsers--;

        io.emit("online-users", onlineUsers);

    });

});

/* SERVER */

http.listen(process.env.PORT || 3000, "0.0.0.0", () => {

    console.log("Running");

});