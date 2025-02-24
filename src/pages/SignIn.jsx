import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function SignIn() {
  return (
    <div className="flex flex-col justify-center items-center p-4 w-screen md:w-120 mx-auto">
      <h1 className="text-[#333333] text-2xl font-bold text-center">
        Welcome Back!
      </h1>
      <form className="flex flex-col items-center gap-4 w-screen p-6 sm:w-120 text-[#94a3b8] text-sm">
        <input
          type="text"
          className="shadow-md w-full px-2 py-1 rounded-lg outline-[#009a88] md:text-lg"
          placeholder="Email Adress"
        />
        <input
          type="text"
          className="shadow-md w-full px-2 py-1 rounded-lg outline-[#009a88] md:text-lg"
          placeholder="Password"
        />
        <button className="bg-[#009a88] hover:bg-[#007a6a] text-white cursor-pointer outline-none p-2 rounded-xl w-full transition-colors">
          Login
        </button>
        <div className="flex flex-col gap-2 w-full">
          <button className="bg-[#ff6e5d] hover:bg-[#ff4f3d] text-white cursor-pointer text-sm outline-none p-2 rounded-xl w-full flex justify-center items-center gap-1 transition-colors">
            <FaGoogle />
            <span>Sign in with Google</span>
          </button>
          <button className="bg-[#4267b2] hover:bg-[#365899] text-white cursor-pointer text-sm outline-none p-2 rounded-xl w-full flex justify-center items-center gap-1 transition-colors">
            <FaFacebookF />
            <span>Sign in with Facebook</span>
          </button>
        </div>
      </form>
      <Link
        to="/register"
        className="text-[#009a88] hover:text-[#2b5e57] hover:underline transition-colors"
      >
        Don&apos;t have an account? Sign up
      </Link>
    </div>
  );
}
