export default function DeviceStatus(props) {
    return <button class={props.status ? "btn btn-primary" : "btn btn-secondary"} >
      {props.status ? props.device + ': ON' : props.device + ': OFF'}
      </button>
  }