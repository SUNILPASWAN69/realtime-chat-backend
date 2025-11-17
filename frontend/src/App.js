import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

<<<<<<< HEAD
// const socket = io("http://localhost:5000");
const socket = io("https://realtime-chat-backend-2.onrender.com");
=======
// const socket = io("https://realtime-chat-backend-2.onrender.com");
const socket = io("https://realtime-chat-backend-2.onrender.com/", {
  transports: ["websocket"]
});

>>>>>>> 0adfe8ee31bb0aac68410646fdf49a489d755434

function App() {
  const [username, setUsername] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

<<<<<<< HEAD
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.start();
    setRecording(true);

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);

      setRecordedAudio({ blob, url });
      setShowPreview(true);
      setRecording(false);
    };
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const sendVoiceMessage = () => {
    const reader = new FileReader();
    reader.readAsDataURL(recordedAudio.blob);

    reader.onloadend = () => {
      socket.emit("voice_message", {
        user: loggedInUser,
        audio: reader.result,
        time: new Date().toLocaleTimeString(),
      });

      setShowPreview(false);
      setRecordedAudio(null);
    };
  };

  const cancelVoice = () => {
    setShowPreview(false);
    setRecordedAudio(null);
  };

  const joinChat = () => {
    if (username.trim() !== "") {
      setLoggedInUser(username);
      socket.emit("join", username);
    }
  };

  const sendMessage = () => {
=======
  const joinChat = () => {
    if (username.trim() !== "") {
      setLoggedInUser(username);
      socket.emit("join", username); // MUST MATCH BACKEND
    }
  };

   const sendMessage = () => {
>>>>>>> 0adfe8ee31bb0aac68410646fdf49a489d755434
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

    socket.on("receive_voice", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("receive_message");
      socket.off("receive_voice");
      socket.off("online_users");
    };
  }, []);

<<<<<<< HEAD
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
              if (e.key === "Enter") joinChat();
            }}
          />

          <button onClick={joinChat}>Join</button>
=======

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
>>>>>>> 0adfe8ee31bb0aac68410646fdf49a489d755434
        </div>
      ) : (
        <div className="chat-wrapper">
          {/* LEFT PANEL */}
          <div className="left-panel">
            <h3>Online Users</h3>
            <ul className="user-list">
              {onlineUsers.length > 0
                ? onlineUsers.map((u, i) => <li key={i}>{u}</li>)
                : "No one online"}
            </ul>
          </div>

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
                  <strong>{msg.user}</strong>
                  <br />

                  {msg.text && <div>{msg.text}</div>}

                  {msg.audio && (
                    <audio controls src={msg.audio} style={{ marginTop: "5px" }} />
                  )}

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

<<<<<<< HEAD
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                className="record-btn"
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  background: recording ? "red" : "black",
                  color: "white",
                }}
              >
                🎤 {recording ? "Recording..." : "Hold to Record"}
              </button>

              {showPreview && (
                <div
                  style={{
                    background: "#222",
                    padding: "10px",
                    marginTop: "10px",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                >
                  <p>Preview Voice Message:</p>

                  <audio controls src={recordedAudio.url}></audio>

                  <div style={{ marginTop: "8px", display: "flex", gap: "10px" }}>
                    <button
                      onClick={sendVoiceMessage}
                      style={{
                        padding: "6px 12px",
                        background: "green",
                        color: "white",
                        borderRadius: "5px",
                      }}
                    >
                      Send ✔
                    </button>

                    <button
                      onClick={cancelVoice}
                      style={{
                        padding: "6px 12px",
                        background: "red",
                        color: "white",
                        borderRadius: "5px",
                      }}
                    >
                      Cancel ✖
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
=======
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
>>>>>>> 0adfe8ee31bb0aac68410646fdf49a489d755434
        </div>
      )}
    </div>
  );
}
export default App;
