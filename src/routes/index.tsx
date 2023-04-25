import { createSignal, createEffect, on } from "solid-js";
import { HubConnectionBuilder, HubConnectionState, HubConnection } from "@microsoft/signalr";
import toast, { Toaster } from 'solid-toast';
import { VsRefresh } from 'solid-icons/vs';
import { FiWifi } from 'solid-icons/fi';
import { FiWifiOff } from 'solid-icons/fi';
import { AiFillExperiment } from 'solid-icons/ai';
import { VsDebugStart } from 'solid-icons/vs';
import { FaRegularCircleStop } from 'solid-icons/fa';
import { AiTwotoneThunderbolt } from 'solid-icons/ai';
import { RiOthersLightbulbFlashFill } from 'solid-icons/ri';

export default function Home() {
  const [messages, setMessages] = createSignal([]);
  const [notificationMessage, setNotificationMessage] = createSignal("");


  const [connectStatus, setConnectStatus] = createSignal(HubConnectionState.Disconnected);
  const [experimentStatus, setExperimentStatus] = createSignal(false);

  const [currentSource, setCurrentSource] = createSignal(false);
  const [disableCurrentBtn, setDisableCurrentBtn] = createSignal(false);
  
  

  let connection;

  createEffect(() => {
    connection = new HubConnectionBuilder()
      .withUrl("https://130.113.3.225:45457/Hubs/chatHub")
      // .withUrl("https://169.254.165.129:45457/Hubs/chatHub")
      .withAutomaticReconnect()
      .build();
      

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected");
        setConnectStatus(HubConnectionState.Connected);
      })
      .catch((err) => {
        console.log("SignalR Connection Error: ", err);
        setConnectStatus(HubConnectionState.Disconnected);
      });


    connection.on("ReceiveMessage", (message) =>
      setMessages((prevMessages) => [...prevMessages, message])
    );

    connection.on("UpdateCurrentStatus", (status) =>
      setCurrentSource(status)
    );

    connection.on("UpdateExperimentStatus", (status) =>
      setExperimentStatus(status)
    );

    //Server should send another signal on exit/pause
    connection.on("StatusUpdate", (status) =>
      setExperimentStatus(status)
    );

    connection.onclose(error => {
      console.log("DISCONNECTED: " + error);
      setConnectStatus(HubConnectionState.Disconnected);
  });

    return () => {
      connection.stop();
    };
    
  });

  createEffect(on(experimentStatus, (experimentStatus) => {
    console.log(experimentStatus);
    if (experimentStatus){
      toast.success("Experiment is running!");
    }
    else{
      toast.error("Experiment is not running...");
    }
  }, { defer: false }));

  createEffect(on(connectStatus, (connectStatus) => {
    console.log(connectStatus);
    connection.invoke("getCurrentStatus");

    if (connection.state == HubConnectionState.Connecting || HubConnectionState.Disconnecting){
      toast.loading(connection.state.toString());
    }
    else if (connection.state == HubConnectionState.Connected){
      toast.success(connection.state.toString());
    }
    else{
      toast.error(connection.state.toString());
    }
  }, { defer: false }));

  //Create effect when current source is toggled
  createEffect(on(currentSource, (currentSource) => {
    console.log(currentSource);
    if (currentSource){
      toast.success("Current is ON");
    }
    else{
      toast.error("Current is OFF")
    }
    setDisableCurrentBtn(false);
  }, { defer: false }));

  const updateConnectionStatus = () => {
    console.log(connection.state);
    setConnectStatus(connection.state);
  }

  // const updateExperimentStatus = () => {
  //   handleGetExperimentStatus();
  //   console.log(experimentStatus);
  //   setExperimentStatus(experimentStatus);
  // }

  const handleToggleCurrent = async() => {
    //invoke command
    !currentSource() ? connection.invoke("turnCurrentOn") : connection.invoke("turnCurrentOff");
    setDisableCurrentBtn(true);

    //wait for confirmation
    await connection.on("UpdateCurrentStatus", (cStatus) => {
      setCurrentSource(cStatus);
    });

  };

  const handleGetExperimentStatus = async() => {
    console.log(experimentStatus());
    connection.invoke("getExperimentStatus");

    await connection.on("UpdateExperimentStatus", (eStatus) => {
      console.log(eStatus)
      setExperimentStatus(eStatus);
    });
  }

  const handleStartExperiment = async() => {
    connection.invoke("startCapture");

    await connection.on("UpdateExperimentStatus", (eStatus) => {
      setExperimentStatus(eStatus);
    });
  }

  const handleStopExperiment = async() => {
    connection.invoke("stopCapture");

    await connection.on("UpdateExperimentStatus", (eStatus) => {
      setExperimentStatus(eStatus);
    });
  }

  // const handleClick = () => {
  //   const message = document.getElementById("message").value;
  //   console.log(message);
  //   connection.invoke("sendMessage", message);
  //   setNotificationMessage(message);
  //   document.getElementById("message").textContent = "";
  // };

  return (
    <main>
      <Toaster />
        <div class="container-fluid d-flex justify-content-center align-items-center vh-100">
          <div class="row">
            <div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
              <h1 class="text-center mb-4">ReSprint</h1>
              <p class="lead">
                ReSprint Remote Client Interface 
              </p>
              <p> {connectStatus()!==HubConnectionState.Connected ? <FiWifiOff /> : <FiWifi />} Connection: {connectStatus() + " "} 
                <button class={"btn btn-dark"}
                    onClick={updateConnectionStatus}>
                      <VsRefresh />
                  </button>
              </p>
              <p> <AiFillExperiment /> Experiment: {experimentStatus() ? "Running " : "Not Running "} 
                <button class={"btn btn-dark"}
                  onClick={handleGetExperimentStatus}>
                    <VsRefresh />
                  </button>
              </p>
              <p> <RiOthersLightbulbFlashFill /> Current Source: {currentSource() ? 'ON' : 'OFF'} </p>
            </div>
            <hr></hr>
            {/* <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="SPCI Command (i.e. )" aria-label="SPCI Command" aria-describedby="button-addon2"/>
              <button class="btn btn-outline-secondary" type="button" id="button-addon2">Send</button>
            </div> */}

            {/* List of Buttons (ON/OFF) */}
            <div class="container">
              <button
                    type="button"
                    class={"btn btn-primary mb-3"}
                    onClick={handleToggleCurrent}
                    disabled={disableCurrentBtn() || !(connectStatus()==HubConnectionState.Connected)}
                  >
                    {/* <AiTwotoneThunderbolt/> {currentSource() ? 'Current Source: ON' : 'Current Source: OFF'} */}
                    <AiTwotoneThunderbolt/> Turn Current Source (ON/OFF)
                </button>
                <br></br>
                <button
                      type="button"
                      class={"btn btn-success mb-3"}
                      onClick={handleStartExperiment}
                      disabled={!(connectStatus()==HubConnectionState.Connected)}
                    >
                      <VsDebugStart/> Start/Continue Experiment
                </button>
                <br></br>
                <button
                      type="button"
                      class={"btn btn-dark mb-3"}
                      onClick={handleStopExperiment}
                      disabled={!(connectStatus()==HubConnectionState.Connected)}
                    >
                      <FaRegularCircleStop/> Stop Experiment
                    </button>
              </div>
          </div>
        </div>
    </main>
  );
}
