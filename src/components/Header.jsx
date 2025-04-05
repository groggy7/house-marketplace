import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoBookmark, IoPerson } from "react-icons/io5";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { RiMenu3Line } from "react-icons/ri";
import { LuMessageCircleMore } from "react-icons/lu";
import React from "react";
import avatarImage from "../assets/avatar.png";
import home from "../assets/home.svg";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, isAuthenticated } = React.useContext(AuthContext);
  const handleClick = () => {
    const elem = document.activeElement;
    if (elem) {
      elem?.blur();
    }
  };

  return (
    <header className="flex justify-between items-center gap-2 px-8 py-4 shadow-lg">
      <Link className="flex gap-2 items-center" to="/">
        <img src={home} alt="home icon" className="w-6" />
        <span className="font-bold text-[#333333] text-xl">StayBook</span>
      </Link>
      <nav className="hidden md:flex items-center gap-8">
        {isAuthenticated ? (
          <Link className="btn btn-soft btn-primary" to="listings/create">
            Create a listing
          </Link>
        ) : null}
        <NavLink to="/bookmarks">
          {({ isActive }) => (
            <div className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}>
              <IoBookmark size={26} />
            </div>
          )}
        </NavLink>
        <NavLink to="/inbox">
          {({ isActive }) => (
            <div className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}>
              <LuMessageCircleMore size={26} />
            </div>
          )}
        </NavLink>

        <NavLink to="/profile">
          {({ isActive }) => (
            <div className={isActive ? "text-[#009a88]" : "text-[#c1c1c1]"}>
              {isAuthenticated ? (
                <img src={user.picture} alt="avatar" className="w-8" />
              ) : (
                <IoPerson size={26} />
              )}
            </div>
          )}
        </NavLink>
      </nav>
      <div className="dropdown dropdown-end md:hidden">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          {isAuthenticated ? (
            <img src={user.picture} alt="avatar" className="w-8" />
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
            {isAuthenticated && (
              <Link
                to="listings/create"
                className="btn btn-soft btn-primary mt-2"
                onClick={handleClick}
              >
                Create a listing
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
