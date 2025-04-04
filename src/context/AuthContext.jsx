import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/user`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();
      setUser(data.user);
    };

    fetchUser();
  }, []);

  async function Login(username, email, password) {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      setUser(data.user);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function GoogleLogin() {}

  async function Logout() {}

  async function Register(username, email, password) {}

  return (
    <AuthContext.Provider
      value={{
        Login,
        GoogleLogin,
        Register,
        Logout,
        user,
        setUser,
        loading,
        avatar: user?.avatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
