import { createSignal, createEffect } from "solid-js";
import { HubConnectionBuilder } from "@microsoft/signalr";

export default function Home() {
  const [messages, setMessages] = createSignal([]);

  let connection;

  createEffect(() => {
    connection = new HubConnectionBuilder()
      .withUrl("https://differentgoldlamp8.conveyor.cloud/Hubs/chatHub")
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("SignalR Connected"))
      .catch((err) => console.log("SignalR Connection Error: ", err));

    connection.on("ReceiveMessage", (message) =>
      setMessages((prevMessages) => [...prevMessages, message])
    );
    
  });

  const handleClick = () => {
    const message = document.getElementById("message").value;
    console.log(message);
    connection.invoke("sendMessage", message);
    document.getElementById("message").textContent = "";
  };

  return (
    <main>
      <h1>Chat App</h1>
      <input type="text" id="message" placeholder="Type a message"/>
      <button id="send" onClick={handleClick}>Send</button>
      <ul>
        {messages().map((message, index) => (
          <li>{message}</li>
        ))}
      </ul>
    </main>
  );
}
