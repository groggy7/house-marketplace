import { Link } from "react-router-dom";

export default function Footer() {
  const date = new Date();
  return (
    <div className="flex flex-col justify-between items-center bg-[#fcfcfc]">
      <div>{date.getFullYear()} StayBook. All rights reserved.</div>
      <div className="flex gap-4">
        <Link>Terms of Service</Link>
        <Link>Privacy Policy</Link>
      </div>
    </div>
  );
}
