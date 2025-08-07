import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Replace this URL with your deployed backend
const socket = io("https://skillswap-backend-012c.onrender.com/");

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && username.trim()) {
      socket.emit("send_message", { username, message });
      setMessage("");
    }
  };

  return (
    <div style={styles.chatContainer}>
      <h1 style={styles.heading}>💬 Real-Time Dev Chat</h1>

      {!username ? (
        <div style={styles.inputWrapper}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter your name..."
            onKeyDown={(e) => {
              if (e.key === "Enter") setUsername(e.target.value.trim());
            }}
          />
        </div>
      ) : (
        <>
          <div style={styles.chatBox}>
            {messages.map((msg, index) => (
              <div key={index} style={styles.message}>
                <strong style={styles.username}>{msg.username}:</strong>{" "}
                <span>{msg.message}</span>
              </div>
            ))}
          </div>

          <div style={styles.inputWrapper}>
            <input
              style={styles.input}
              type="text"
              value={message}
              placeholder="Type a message..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button style={styles.button} onClick={sendMessage}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  chatContainer: {
    backgroundColor: "#1e1e1e",
    color: "#00ff99",
    fontFamily: "'Courier New', Courier, monospace",
    minHeight: "100vh",
    padding: "20px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  chatBox: {
    border: "1px solid #00ff99",
    padding: "10px",
    borderRadius: "8px",
    height: "60vh",
    overflowY: "auto",
    backgroundColor: "#121212",
  },
  inputWrapper: {
    display: "flex",
    marginTop: "10px",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#222",
    color: "#00ff99",
    border: "1px solid #00ff99",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#00ff99",
    color: "#000",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    margin: "5px 0",
  },
  username: {
    color: "#00ccff",
  },
};

export default ChatPage;