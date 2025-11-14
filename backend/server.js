const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store online users
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // WHEN USER JOINS
  socket.on("join", (username) => {
    onlineUsers[socket.id] = username;

    // Broadcast updated user list
    io.emit("online_users", Object.values(onlineUsers));
  });

  // WHEN USER SENDS MESSAGE
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  // WHEN USER DISCONNECTS
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete onlineUsers[socket.id];
    
    io.emit("online_users", Object.values(onlineUsers));
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
