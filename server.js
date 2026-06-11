// ==========================
// IMPORTS
// ==========================

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// ==========================
// APP SETUP
// ==========================

const app = express();

const server = http.createServer(app);

const io = new Server(server);

// ==========================
// PORT
// ==========================

const PORT = process.env.PORT || 3000;

// ==========================
// STATIC FILES
// ==========================

app.use(express.static(__dirname));

// ==========================
// USERS
// ==========================

let onlineUsers = 0;

// ==========================
// SOCKET CONNECTION
// ==========================

io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);

  // ==========================
  // JOIN USER
  // ==========================

  socket.on("join-user", (userData) => {

    socket.username = userData.name;

    socket.userColor = userData.color;

    onlineUsers++;

    // SEND ONLINE COUNT

    io.emit("online-users", onlineUsers);

    // JOIN MESSAGE

    io.emit("receive-message", {

      name: "System",
      color: "#00c896",
      text: `${userData.name} joined the chat 🚀`,
      time: getTime()

    });

    console.log(userData.name + " joined");

  });

  // ==========================
  // SEND MESSAGE
  // ==========================

  socket.on("send-message", (data) => {

    io.emit("receive-message", data);

  });

  // ==========================
  // TYPING
  // ==========================

  socket.on("typing", (name) => {

    socket.broadcast.emit("show-typing", name);

  });

  // ==========================
  // STOP TYPING
  // ==========================

  socket.on("stop-typing", () => {

    socket.broadcast.emit("hide-typing");

  });

  // ==========================
  // DISCONNECT
  // ==========================

  socket.on("disconnect", () => {

    if(socket.username){

      onlineUsers--;

      if(onlineUsers < 0){

        onlineUsers = 0;

      }

      // UPDATE ONLINE

      io.emit("online-users", onlineUsers);

      // LEAVE MESSAGE

      io.emit("receive-message", {

        name: "System",
        color: "#ff4d6d",
        text: `${socket.username} left the chat 👋`,
        time: getTime()

      });

      console.log(socket.username + " disconnected");

    }

  });

});

// ==========================
// HOME ROUTE
// ==========================

app.get("/", (req, res) => {

  res.sendFile(path.join(__dirname, "index.html"));

});

// ==========================
// TIME FUNCTION
// ==========================

function getTime(){

  const now = new Date();

  let hours = now.getHours();

  let minutes = now.getMinutes();

  minutes = minutes < 10
    ? "0" + minutes
    : minutes;

  return hours + ":" + minutes;

}

// ==========================
// START SERVER
// ==========================

server.listen(PORT, () => {

  console.log(`
=================================
🚀 Nearby Chat Server Running
🌐 http://localhost:${PORT}
=================================
  `);

});