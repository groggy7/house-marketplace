import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

export default function SignIn() {
  return (
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
