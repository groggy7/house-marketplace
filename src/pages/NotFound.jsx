import notFound from "../assets/404.png";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center absolute 
      top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
    >
      <div className="space-y-6 max-w-md flex flex-col items-center">
        <img src={notFound} alt="404" className="w-36 lg:w-48" />
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mt-0">
          Page not found
        </h1>
        <p className="text-gray-500 md:text-lg">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or deleted.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 bg-[#009a88] hover:bg-[#009a88]/90 text-white transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
