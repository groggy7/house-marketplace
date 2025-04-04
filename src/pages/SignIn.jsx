import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export default function SignIn() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
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
