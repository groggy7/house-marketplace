import { FaGoogle, FaFacebookF } from "react-icons/fa";
import React from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

export default function LoginForm() {
  const { Login, loading, error } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  async function handleAction(formdata) {
    const email = formdata.get("email");
    const password = formdata.get("password");
    const result = await Login(email, password);

    if (!error && result !== false) {
      toast.success("Login successful");
    }
  }

  return (
    <>
      {loading ? <Spinner /> : null}
      <form
        action={handleAction}
        className="flex flex-col items-center gap-4 w-screen p-6 sm:w-120 text-[#94a3b8] text-sm"
      >
        <input
          type="email"
          name="email"
          className="shadow-md w-full px-2 py-1 rounded-lg outline-[#009a88] md:text-lg"
          placeholder="Email Address"
          required
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          className="shadow-md w-full px-2 py-1 rounded-lg outline-[#009a88] md:text-lg"
          placeholder="Password"
          required
          disabled={loading}
        />
        <button
          className="bg-[#009a88] hover:bg-[#007a6a] text-white cursor-pointer outline-none p-2 rounded-xl w-full transition-colors"
          disabled={loading}
        >
          Login
        </button>
        <div className="flex flex-col gap-2 w-full">
          <button
            className="bg-[#ff6e5d] hover:bg-[#ff4f3d] text-white cursor-pointer text-sm outline-none p-2 rounded-xl w-full flex justify-center items-center gap-1 transition-colors"
            disabled={loading}
            onClick={() => loginWithRedirect({ connection: "google-oauth2" })}
          >
            <FaGoogle />
            <span>Sign in with Google</span>
          </button>
          <button
            className="bg-[#4267b2] hover:bg-[#365899] text-white cursor-pointer text-sm outline-none p-2 rounded-xl w-full flex justify-center items-center gap-1 transition-colors"
            onClick={() => loginWithRedirect({ connection: "facebook" })}
            disabled={loading}
          >
            <FaFacebookF />
            <span>Sign in with Facebook</span>
          </button>
        </div>
      </form>
    </>
  );
}
