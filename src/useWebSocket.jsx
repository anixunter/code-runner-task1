import { useEffect, useRef, useState } from "react";

const useWebSocket = (url) => {
  const [output, setOutput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onmessage = (event) => {
      console.log(event);

      const response = JSON.parse(event.data);
      console.log(response);

      if (["stdout", "stderr"].includes(response.type)) {
        setOutput((prevOutput) => prevOutput + response.data);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url]);

  const sendCode = (payload) => {
    console.log("SentObject", payload);

    if (payload.command == "stop") {
      setOutput("");
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    } else {
      console.error("WebSocket is not open");
    }
  };

  return { output, sendCode };
};

export default useWebSocket;
