import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
export default function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
}
