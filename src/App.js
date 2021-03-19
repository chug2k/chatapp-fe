import logo from "./logo.svg";
import socketIOClient from "socket.io-client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { ProgressBar, Container, Button } from "react-bootstrap";
import "./App.css";
let socket;

function App() {
  useEffect(() => {
    socket = socketIOClient("https://9091e0bcc2e2.ngrok.io");
    return () => {
      socket.disconnect();
    };
  }, []);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [total, setTotal] = useState(0);
  const [yesCount, setYesCount] = useState(0);
  const [maybeCount, setMaybeCount] = useState(0);
  const [noCount, setNoCount] = useState(0);

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

  const sendVote = (vote) => {
    socket.emit("vote", vote);
  };

  useEffect(() => {
    socket.on("receiveVote", (vote) => {
      setTotal(total + 1);
      if (vote === "yes") {
        setYesCount(yesCount + 1);
      }
      if (vote === "maybe") {
        setMaybeCount(maybeCount + 1);
      }
      if (vote === "no") {
        setNoCount(noCount + 1);
      }
    });
  }, [total, yesCount, maybeCount, noCount]);

  return (
    <div className="App">
      <h1> Hello World! </h1>
      <Container>
        <h2>Does today's lesson make sense?</h2>
        <Button variant="success" onClick={() => sendVote("yes")}>
          Yes
        </Button>
        <Button variant="warning" onClick={() => sendVote("maybe")}>
          Maybe
        </Button>
        <Button variant="danger" onClick={() => sendVote("no")}>
          No
        </Button>

        <ProgressBar
          now={(yesCount / total) * 100}
          animated
          variant="success"
        />
        <ProgressBar
          now={(maybeCount / total) * 100}
          animated
          variant="warning"
        />
        <ProgressBar now={(noCount / total) * 100} animated variant="danger" />
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
