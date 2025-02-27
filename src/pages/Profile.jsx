import { AuthContext } from "../context/AuthContext";
import React from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.png";
import person from "../assets/person.svg";
import documents from "../assets/documents.svg";
import payment from "../assets/payment.svg";
import security from "../assets/security.svg";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }
  return (
    <div className="p-8 w-full max-w-200 mx-auto">
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="shadow-[0px_2px_10px_rgba(3,3,3,0.1)] rounded-lg flex gap-4 mt-8 py-6 px-8">
        <div className="flex flex-col justify-center items-center gap-4">
          <img src={avatar} alt="avatar" className="w-20" />
          <span className="font-bold">{user.name.split(" ")[0]}</span>
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
      <div className="shadow-[0px_2px_10px_rgba(3,3,3,0.1)] rounded-lg flex gap-4 p-2 items-center my-3">
        <img src={person} alt="person icon" className="w-[24px]" />
        <span>Personal information</span>
      </div>
      <div className="shadow-[0px_2px_10px_rgba(3,3,3,0.1)] rounded-lg flex gap-4 p-2 items-center my-3">
        <img
          src={documents}
          alt="travel documents icon"
          className="w-[16px] ml-1"
        />
        <span>Travel documents</span>
      </div>
      <div className="shadow-[0px_2px_10px_rgba(3,3,3,0.1)] rounded-lg flex gap-4 p-2 items-center my-3">
        <img src={payment} alt="person icon" className="w-[24px]" />
        <span>Payment methods</span>
      </div>
      <div className="shadow-[0px_2px_10px_rgba(3,3,3,0.1)] rounded-lg flex gap-4 p-2 items-center my-3">
        <img src={security} alt="person icon" className="w-[24px]" />
        <span>Security</span>
      </div>
    </div>
  );
}
