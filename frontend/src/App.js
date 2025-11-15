import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

// const socket = io("https://realtime-chat-backend-2.onrender.com");
const socket = io("https://realtime-chat-backend-2.onrender.com/", {
  transports: ["websocket"]
});


function App() {
  const [username, setUsername] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const joinChat = () => {
    if (username.trim() !== "") {
      setLoggedInUser(username);
      socket.emit("join", username); // MUST MATCH BACKEND
    }
  };

   const sendMessage = () => {
    if (message.trim() !== "") {
      const msgData = {
        user: loggedInUser,
        text: message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message", msgData);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("online_users", (users) => {
      console.log("Online users:", users);
      setOnlineUsers(users);
    });

    return () => {
      socket.off("receive_message");
      socket.off("online_users");
    };
  }, []);


return (
  <div className="main-wrapper">

    {!loggedInUser ? (
      <div className="login-box">
        <h2>Enter Username</h2>

       <input
        type="text"
        placeholder="Enter your name..."
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => {
        if (e.key === "Enter") {
            joinChat();
          }
        }}
        />

        <button onClick={joinChat}>Join</button>
      </div>
    ) : (

      <div className="chat-wrapper">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <h3>Online Users</h3>

          <ul className="user-list">
            {onlineUsers.length > 0 ? (
              onlineUsers.map((u, i) => (
                <li key={i} className="user-item">{u}</li>
              ))
            ) : (
              <li className="user-item">No one online</li>
            )}
          </ul>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <h3 className="header">Logged in as: {loggedInUser}</h3>

          <div className="messages-area">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-bubble ${
                  msg.user === loggedInUser ? "me" : "other"
                }`}
              >
                <strong>{msg.user}</strong><br />
                {msg.text}
                <div className="time">{msg.time}</div>
              </div>
            ))}
          </div>

          <div className="input-area">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                style={{ display: "flex", width: "100%" }}
              >
                <input
                  type="text"
                  value={message}
                  placeholder="Type a message..."
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ flex: 1 }}
                />

                <button type="submit">Send</button>
              </form>
            </div>
        </div>

      </div>
    )}

  </div>
);

}
export default App;
