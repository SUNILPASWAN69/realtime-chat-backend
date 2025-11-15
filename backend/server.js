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

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (username) => {
    console.log("User joined:", username);

    onlineUsers[socket.id] = username;

    io.emit("online_users", Object.values(onlineUsers));
  });
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    delete onlineUsers[socket.id];

    io.emit("online_users", Object.values(onlineUsers));
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
