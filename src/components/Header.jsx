import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoBookmark, IoPerson } from "react-icons/io5";
import { AiFillSchedule } from "react-icons/ai";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { RiMenu3Line } from "react-icons/ri";
import { LuMessageCircleMore } from "react-icons/lu";
import { AuthContext } from "../context/AuthContext";
import React from "react";
import avatar from "../assets/avatar.png";

export default function Header() {
  const { user } = React.useContext(AuthContext);
  const handleClick = () => {
    const elem = document.activeElement;
    if (elem) {
      elem?.blur();
    }
  };

  return (
    <header className="flex justify-between items-center gap-2 px-8 py-4 shadow-lg">
      <Link className="flex gap-2 items-center" to="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "24px",
            height: "24px",
            overflow: "visible",
            fill: "rgb(0, 154, 136)",
          }}
          viewBox="0 0 576 512"
        >
          <path
            d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 
            16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 
            182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5
            31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"
          ></path>
        </svg>
        <span className="font-bold text-[#333333] text-xl">StayBook</span>
      </Link>
      <nav className="hidden md:flex items-center gap-8">
        <NavLink to="/bookmarks">
          {({ isActive }) => (
            <div className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}>
              <IoBookmark size={26} />
            </div>
          )}
        </NavLink>
        <NavLink to="/bookings">
          {({ isActive }) => (
            <div className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}>
              <AiFillSchedule size={26} isActive={isActive} />
            </div>
          )}
        </NavLink>

        <NavLink to="/inbox">
          {({ isActive }) => (
            <div className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}>
              <LuMessageCircleMore size={26} isActive={isActive} />
            </div>
          )}
        </NavLink>

        <NavLink to="/profile">
          {({ isActive }) => (
            <div className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}>
              {user ? (
                <img src={avatar} alt="avatar" className="w-8" />
              ) : (
                <IoPerson size={26} isActive={isActive} />
              )}
            </div>
          )}
        </NavLink>
      </nav>
      <div className="dropdown dropdown-end md:hidden">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          {user ? (
            <img src={avatar} alt="avatar" className="w-8" />
          ) : (
            <RiMenu3Line size={24} />
          )}
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <NavLink
              to="/bookmarks"
              className="flex items-center gap-2 p-2"
              onClick={handleClick}
            >
              {({ isActive }) => (
                <>
                  <IoBookmark
                    size={20}
                    className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}
                  />
                  <span
                    className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}
                  >
                    Bookmarks
                  </span>
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bookings"
              className="flex items-center gap-2 p-2"
              onClick={handleClick}
            >
              {({ isActive }) => (
                <>
                  <AiFillSchedule
                    size={20}
                    className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}
                  />
                  <span
                    className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}
                  >
                    Bookings
                  </span>
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/inbox"
              className="flex items-center gap-2 p-2"
              onClick={handleClick}
            >
              {({ isActive }) => (
                <>
                  <BiSolidMessageRoundedDetail
                    size={20}
                    className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}
                  />
                  <span
                    className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}
                  >
                    Inbox
                  </span>
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className="flex items-center gap-2 p-2"
              onClick={handleClick}
            >
              {({ isActive }) => (
                <>
                  <IoPerson
                    size={20}
                    className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}
                  />
                  <span
                    className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}
                  >
                    Profile
                  </span>
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
}
