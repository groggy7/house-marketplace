import {
  useRef,
  useCallback,
  useEffect,
  useContext,
  useState,
  createContext
} from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const WebSocketContext = createContext();

export default function WebSocketProvider({ children }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const messageCallbacksRef = useRef(new Set());
  const location = useLocation();

  // Use a ref to get the latest location in callbacks without re-triggering effects
  const locationRef = useRef(location);
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const addMessageCallback = useCallback((callback) => {
    messageCallbacksRef.current.add(callback);
    return () => {
      messageCallbacksRef.current.delete(callback);
    };
  }, []);

  const connect = useCallback(() => {
    // Don't reconnect if already connected or connecting
    if (socketRef.current && socketRef.current.readyState < 2) {
      // 0:CONNECTING, 1:OPEN
      return;
    }

    // Clear any existing reconnect timer
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    const ws = new WebSocket(`${import.meta.env.VITE_WS_SERVER_HEROKU}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      reconnectAttemptsRef.current = 0; // Reset on successful connection
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
        // Notify all subscribers
        messageCallbacksRef.current.forEach((callback) => callback(data));

        switch (data.type) {
          case "auth_success":
            setIsConnected(true);
            break;
          case "message":
            // Show toast only if not on the inbox page
            if (locationRef.current.pathname !== "/inbox") {
              toast(data.text, {
                icon: "💬",
                duration: 3000,
                position: "top-right",
                className: "ws-toast",
                onClick: () => {
                  window.location.href = "/inbox";
                },
              });
            }
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
      console.log("WebSocket disconnected");
      setIsConnected(false);

      // Only attempt to reconnect if the user is still authenticated.
      if (isAuthenticated) {
        const delay = Math.min(30000, 1000 * 2 ** reconnectAttemptsRef.current);
        reconnectAttemptsRef.current++;
        console.log(`Attempting to reconnect in ${delay / 1000} seconds...`);
        reconnectTimerRef.current = setTimeout(connect, delay);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
  }, [user, isAuthenticated]); // Dependencies for the connect function

  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    } else {
      // User logged out, cleanup
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
      reconnectAttemptsRef.current = 0;
    }

    // Cleanup on component unmount
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [isAuthenticated, user, connect]);

  const value = {
    socket: socketRef.current,
    isConnected,
    addMessageCallback,
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
