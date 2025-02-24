import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col justify-between gap-4">
      <Header />
      <Outlet />
      <Navbar />
    </div>
  );
}
