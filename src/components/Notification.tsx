import { createSignal, createEffect } from "solid-js";

export default function Notification(props) {
  const [showNotification, setShowNotification] = createSignal(false);

  createEffect(() => {
    let timer;

    if (props.message) {
      setShowNotification(true);
      timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }

    return () => clearTimeout(timer);
  });

  return (
    <div>
      {showNotification() && <div>{props.message}</div>}
    </div>
  );
}
