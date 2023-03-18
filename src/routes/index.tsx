import { createSignal, createEffect } from "solid-js";
import { HubConnectionBuilder } from "@microsoft/signalr";
import ToggleButton from "~/components/ToggleButton";
import DropdownMenu from "~/components/DropdownMenu";
import ConnectionStatus from "~/components/ConnectionStatus";
import Notification from "~/components/Notification";


export default function Home() {
  const [messages, setMessages] = createSignal([]);
  const [connectStatus, setConnectStatus] = createSignal(false);
  const [notificationMessage, setNotificationMessage] = createSignal("");

  let connection;
  let isConnected;

  createEffect(() => {
    connection = new HubConnectionBuilder()
      .withUrl("https://earlyyellowrock19.conveyor.cloud/Hubs/chatHub")
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected");
        setConnectStatus(true);
      })
      .catch((err) => {
        console.log("SignalR Connection Error: ", err);
        setConnectStatus(false);
      });

    connection.on("ReceiveMessage", (message) =>
      setMessages((prevMessages) => [...prevMessages, message])
    );

    return () => {
      connection.stop();
    };
    
  });

  const handleClick = () => {
    const message = document.getElementById("message").value;
    console.log(message);
    connection.invoke("sendMessage", message);
    setNotificationMessage(message);
    document.getElementById("message").textContent = "";
  };

  return (
    <main>
      <div class="container">
        <h1>RESPRINT</h1>
        <input type="text" id="message" placeholder="Type a message"/>
        <button id="send" onClick={handleClick}>Send</button>
        <ToggleButton/>
        <DropdownMenu/>
        <ConnectionStatus isConnected={connectStatus()}/>
        <Notification message={notificationMessage()} />
      </div>
    </main>
  );
}
