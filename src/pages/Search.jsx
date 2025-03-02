import { IoSearchSharp } from "react-icons/io5";
export default function Search() {
  return (
    <div className="m-4">
      <form>
        <div className="relative max-w-200 mx-auto">
          <input
            type="text"
            name="search"
            placeholder="Enter location"
            className="px-3 py-2 rounded-lg text-[#7f7f7f] shadow-input mx-auto relative w-full outline-0"
          />
          <button>
            <IoSearchSharp
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              size={24}
            />
          </button>
        </div>
      </form>
    </div>
  );
}
