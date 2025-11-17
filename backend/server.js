// backend/server.js

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
    methods: ["GET", "POST"],
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  //this Is fOr voice massegee
  socket.on("voice_message", (data) => {
    socket.broadcast.emit("receive_voice", data);
  });

  

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

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// // { socketId: username }
// let onlineUsers = {};

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // USER JOINS
//   socket.on("join", (username) => {
//     onlineUsers[socket.id] = username;

//     // Send simple list (frontend ke hisab se)
//     io.emit("online_users", Object.values(onlineUsers));

//     // Send detailed list for call logic (frontend me add kar lena)
//     io.emit(
//       "online_users_detailed",
//       Object.entries(onlineUsers).map(([id, name]) => ({
//         socketId: id,
//         username: name,
//       }))
//     );
//   });

//   // CHAT MESSAGE
//   socket.on("send_message", (data) => {
//     io.emit("receive_message", data);
//   });

//   // 🔥 CALL LOGIC BELOW 🔥

//   // CALL REQUEST
//   socket.on("call-user", ({ toSocketId, fromUser }) => {
//     io.to(toSocketId).emit("incoming-call", {
//       fromSocketId: socket.id,
//       fromUser,
//     });
//   });

//   // OFFER
//   socket.on("send-offer", ({ toSocketId, offer }) => {
//     io.to(toSocketId).emit("receive-offer", {
//       fromSocketId: socket.id,
//       offer,
//     });
//   });

//   // ANSWER
//   socket.on("send-answer", ({ toSocketId, answer }) => {
//     io.to(toSocketId).emit("receive-answer", {
//       fromSocketId: socket.id,
//       answer,
//     });
//   });

//   // ICE CANDIDATE
//   socket.on("send-ice", ({ toSocketId, candidate }) => {
//     io.to(toSocketId).emit("receive-ice", {
//       fromSocketId: socket.id,
//       candidate,
//     });
//   });

//   // END CALL
//   socket.on("end-call", ({ toSocketId }) => {
//     io.to(toSocketId).emit("call-ended");
//   });

//   // DISCONNECT
//   socket.on("disconnect", () => {
//     delete onlineUsers[socket.id];

//     io.emit("online_users", Object.values(onlineUsers));

//     io.emit(
//       "online_users_detailed",
//       Object.entries(onlineUsers).map(([id, name]) => ({
//         socketId: id,
//         username: name,
//       }))
//     );
//   });
// });

// server.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
