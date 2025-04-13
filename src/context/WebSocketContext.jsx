import React from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const WebSocketContext = React.createContext();

export default function WebSocketProvider({ children }) {
  const { isAuthenticated, user } = React.useContext(AuthContext);
  const [socket, setSocket] = React.useState(null);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      const ws = new WebSocket(`${import.meta.env.VITE_WS_SERVER_HEROKU}`);

      ws.onopen = () => {
        setIsConnected(true);
        ws.send(
          JSON.stringify({
            type: "auth",
            user_id: user.id,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "auth_success":
              setIsConnected(true);
              break;
            case "message":
              toast(data.text, {
                icon: "💬",
                duration: 10000,
                position: "top-right",
                className: "ws-toast",
              });
              break;
            case "status":
              break;
            default:
              console.log("Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
        setIsConnected(false);
      };

      setSocket(ws);

      return () => {
        if (ws) {
          ws.close();
        }
      };
    } else {
      setIsConnected(false);
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [isAuthenticated, user]);

  const value = {
    socket,
    isConnected,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
