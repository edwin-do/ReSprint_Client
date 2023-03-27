import { createSignal } from "solid-js";
import "./ToggleButton.css";

export default function ToggleButton({handleClick}, props) {
  
  return (
    <button class={`toggle-button ${props.isOn ? "on" : "off"}`} onClick={handleClick}>
      {props.isOn ? "ON" : "OFF"}
    </button>
  );
}
