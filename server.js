const express = require("express");

const app = express();

const http = require("http").createServer(app);

const io = require("socket.io")(http);

app.use(express.static("public"));

let users = 0;

io.on("connection", (socket)=>{

    users++;

    io.emit("online-users", users);

    socket.on("send-message", (data)=>{

        io.emit("receive-message", data);

    });

    socket.on("edit-message", (data)=>{

        io.emit("message-edited", data);

    });

    socket.on("disconnect", ()=>{

        users--;

        io.emit("online-users", users);

    });

});

const PORT = process.env.PORT || 3000;

http.listen(PORT, "0.0.0.0", ()=>{

    console.log("Server Running");

});