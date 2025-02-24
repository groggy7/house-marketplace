import { NavLink } from "react-router-dom";
import { SearchIcon } from "./icons/SearchIcon";
import { StarIcon } from "./icons/StarIcon";
import { BookingsIcon } from "./icons/BookingsIcon";
import { InboxIcon } from "./icons/InboxIcon";
import { ProfileIcon } from "./icons/ProfileIcon";

export default function Navbar() {
  return (
    <div className="flex justify-between px-6 py-3 md:justify-center md:gap-8">
      <NavLink to="/search">
        {({ isActive }) => (
          <div
            className={`flex flex-col items-center ${
              isActive ? "text-[#009a88]" : "text-[#c1c1c1]"
            }`}
          >
            <SearchIcon isActive={isActive} />
            <span>Search</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/starred">
        {({ isActive }) => (
          <div
            className={`flex flex-col items-center ${
              isActive ? "text-[#009a88]" : "text-[#c1c1c1]"
            }`}
          >
            <StarIcon isActive={isActive} />
            <span>Starred</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/bookings">
        {({ isActive }) => (
          <div
            className={`flex flex-col items-center ${
              isActive ? "text-[#009a88]" : "text-[#c1c1c1]"
            }`}
          >
            <BookingsIcon isActive={isActive} />
            <span>Bookings</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/inbox">
        {({ isActive }) => (
          <div
            className={`flex flex-col items-center ${
              isActive ? "text-[#009a88]" : "text-[#c1c1c1]"
            }`}
          >
            <InboxIcon isActive={isActive} />
            <span>Inbox</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/register">
        {({ isActive }) => (
          <div
            className={`flex flex-col items-center ${
              isActive ? "text-[#009a88]" : "text-[#c1c1c1]"
            }`}
          >
            <ProfileIcon isActive={isActive} />
            <span>Profile</span>
          </div>
        )}
      </NavLink>
    </div>
  );
}
