import { AuthContext } from "../context/AuthContext";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatarImage from "../assets/avatar.png";
import person from "../assets/person.svg";
import payment from "../assets/payment.svg";
import security from "../assets/security.svg";

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading, Logout } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="p-8 w-full max-w-200 mx-auto">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          className="bg-[#009a88] text-white py-1 px-3 rounded-lg hover:bg-[#2b5e57] transition-colors"
          onClick={Logout}
        >
          Logout
        </button>
      </div>
      <div className="shadow-[0px_2px_10px_rgba(3,3,3,0.1)] rounded-lg flex gap-4 mt-8 py-6 px-8">
        <div className="flex flex-col justify-center items-center gap-4">
          <img
            src={user.avatar_url || avatarImage}
            alt="avatar"
            className="w-20"
          />
          <span className="font-bold">{user.full_name.split(" ")[0]}</span>
        </div>
        <div className="w-[2px] bg-[#e5e5e5]"></div>
        <div className="flex flex-col gap-2 justify-center px-2 flex-auto">
          <span>
            <span className="block text-xl font-bold">42</span>visits
          </span>
          <div className="h-[2px] bg-[#e5e5e5]"></div>
          <span>
            <span className="block text-xl font-bold">4,2/5</span>rating
          </span>
        </div>
      </div>
      <h3 className="text-xl font-semibold my-4">Settings</h3>
      <Link
        className="shadow-[0px_2px_10px_rgba(3,3,3,0.1)] rounded-lg flex gap-4 p-2 items-center my-3"
        to="personal"
      >
        <img src={person} alt="person icon" className="w-[24px]" />
        <span>Personal information</span>
      </Link>
      <Link
        className="shadow-[0px_2px_10px_rgba(3,3,3,0.1)] rounded-lg flex gap-4 p-2 items-center my-3"
        //to="documents"
      >
        <img src={payment} alt="person icon" className="w-[24px]" />
        <span>Payment methods</span>
      </Link>
      <Link
        className="shadow-[0px_2px_10px_rgba(3,3,3,0.1)] rounded-lg flex gap-4 p-2 items-center my-3"
        to="security"
      >
        <img src={security} alt="person icon" className="w-[24px]" />
        <span>Security</span>
      </Link>
    </div>
  );
}
