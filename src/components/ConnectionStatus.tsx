import { createSignal } from "solid-js";
import "./ConnectionStatus.css";

export default function ConnectionStatus(props) {
  const [isConnected, setIsConnected] = createSignal(props.isConnected);

  function handleDisconnect() {
    setIsConnected(false);
  }

  function handleConnect() {
    setIsConnected(true);
  }

  return (
    <div class={`connection-status ${isConnected() ? "connected" : "disconnected"}`}>
      {isConnected() ? (
        <div class="connected-message">Connected</div>
      ) : (
        <div class="disconnected-message">
          Disconnected <button onClick={handleConnect}>Reconnect</button>
        </div>
      )}
      {!isConnected() && <div class="disconnect-overlay" onClick={handleDisconnect}></div>}
    </div>
  );
}
