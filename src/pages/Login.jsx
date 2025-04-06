import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { AuthContext } from "../context/AuthContext";
import React from "react";

export default function Login() {
  const { isAuthenticated } = React.useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? null : (
    <div className="flex flex-col justify-center items-center p-4 w-screen md:w-120 mx-auto">
      <h1 className="text-[#333333] text-2xl font-bold text-center">
        Welcome Back!
      </h1>
      <LoginForm />
      <Link
        to="/register"
        className="text-[#009a88] hover:text-[#2b5e57] hover:underline transition-colors"
      >
        Don&apos;t have an account? Sign up
      </Link>
    </div>
  );
}
