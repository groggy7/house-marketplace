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
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              type: "auth",
              user_id: user.id,
            })
          );
          setIsConnected(true);
        }, 10000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "message":
              toast(data.text, {
                icon: "💬",
                duration: 10000,
                position: "top-right",
                className: "ws-toast",
              });
              break;
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
