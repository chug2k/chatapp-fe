import logo from "./logo.svg";
import socketIOClient from "socket.io-client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { ProgressBar, Container, Button } from "react-bootstrap";
import "./App.css";
let socket;

function App() {
  useEffect(() => {
    socket = socketIOClient("http://9091e0bcc2e2.ngrok.io");
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
      <Container>
        <h2>Does today's lesson make sense?</h2>
        <Button variant="success">Yes</Button>
        <Button variant="warning">Maybe</Button>
        <Button variant="danger">No</Button>

        <ProgressBar now={50} animated variant="success" />
        <ProgressBar now={50} animated variant="warning" />
        <ProgressBar now={50} animated variant="danger" />
      </Container>

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
