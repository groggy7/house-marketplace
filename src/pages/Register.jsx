import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { AuthContext } from "../context/AuthContext";
import React from "react";

export default function Register() {
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();

  if (user) {
    navigate("/");
  }

  return user ? null : (
    <div className="flex flex-col justify-center items-center p-4 w-screen md:w-120 mx-auto">
      <h1 className="text-[#333333] text-2xl font-bold text-center">
        Create Your Account
      </h1>
      <RegisterForm />
      <Link
        to="/login"
        className="text-[#009a88] hover:text-[#2b5e57] hover:underline transition-colors"
      >
        Already have an account? Login
      </Link>
    </div>
  );
}
