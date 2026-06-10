const express = require("express");

const app = express();

const http = require("http")
.createServer(app);

const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket)=>{

    socket.on("send-message", (data)=>{

        io.emit("receive-message", data);

    });

});

http.listen(3000, "0.0.0.0", ()=>{

    console.log("Running");

});