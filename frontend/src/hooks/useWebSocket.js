import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

const useCustomWebSocket = (socketUrl, onMessageCallback) => {
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      try {
        const parsedMessage = JSON.parse(lastMessage.data);
        onMessageCallback(parsedMessage);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage]);

  return {
    sendMessage,
    readyState,
  };
};

export default useCustomWebSocket;
