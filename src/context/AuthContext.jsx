import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/user`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setError(error.message || "An unexpected error occurred");
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("isLoggedIn");
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("isLoggedIn")) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  async function Login(email, password) {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("isLoggedIn", "true");
        setUser(data.user);
        setIsAuthenticated(true);
        navigate("/");
        return true;
      } else {
        const data = await response.json();
        setError(data.error);
        return false;
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function GoogleLogin() {}

  async function Logout() {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.removeItem("isLoggedIn");
      setUser(null);
      setIsAuthenticated(false);

      if (response.ok) {
        navigate("/login");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        const data = await response.json();
        setError(data.error || "Logout failed");
        navigate("/login");
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred during logout");
      localStorage.removeItem("isLoggedIn");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  async function Register(name, email, username, password) {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ full_name: name, email, username, password }),
        }
      );

      if (response.ok) {
        navigate("/login");
        return true;
      } else {
        const data = await response.json();
        setError(data.error);
        return false;
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        Login,
        GoogleLogin,
        Register,
        Logout,
        user,
        error,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
