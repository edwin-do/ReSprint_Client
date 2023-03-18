import { createSignal } from "solid-js";
import "./DropdownMenu.css";

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = createSignal(false);

  function toggleMenu() {
    setIsOpen(!isOpen());
  }

  return (
    <div class="dropdown-menu">
      <button class="dropdown-toggle" onClick={toggleMenu}>
        Select an option
      </button>
      {isOpen() && (
        <ul class="dropdown-list">
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      )}
    </div>
  );
}
