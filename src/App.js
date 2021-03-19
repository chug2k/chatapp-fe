import logo from "./logo.svg";
import socketIOClient from "socket.io-client";
import React, { useEffect, useState } from "react";
import "./App.css";
let socket;

function App() {
  useEffect(() => {
    socket = socketIOClient("http://35c071c0a287.ngrok.io/");
    return () => {
      socket.disconnect();
    };
  }, []);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("receive", (msg) => {
      setMessages([...messages, msg]);
    });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("Sending ... " + newMessage);
    socket.emit("send", newMessage);
    setNewMessage("");
  };

  return (
    <div className="App">
      <h1> Hello World! </h1>
      <form onSubmit={sendMessage}>
        <label htmlFor="message">Enter your message</label>
        <input
          type="text"
          name="message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <input type="submit" value="send message" />
      </form>
      <ul>
        {messages.map((m) => (
          <li>{m}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
