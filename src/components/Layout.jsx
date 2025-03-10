import { Outlet } from "react-router-dom";
import Header from "./Header";
export default function Layout() {
  return (
    <div className="max-w-[1400px] mx-auto">
      <Header />
      <Outlet />
    </div>
  );
}
