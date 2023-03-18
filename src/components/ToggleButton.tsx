import { createSignal } from "solid-js";
import "./ToggleButton.css";

export default function ToggleButton() {
  const [isOn, setIsOn] = createSignal(false);

  function handleClick() {
    setIsOn(!isOn());
  }

  return (
    <button class={`toggle-button ${isOn() ? "on" : "off"}`} onClick={handleClick}>
      {isOn() ? "ON" : "OFF"}
    </button>
  );
}
