import { IoSearchSharp } from "react-icons/io5";
import React from "react";
import Listings from "../components/Listings";
import Spinner from "../components/Spinner";

export default function Search() {
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filteredListings, setFilteredListings] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState("All");
  const formRef = React.useRef(null);

  function handleSearch(e) {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData(e.target);
    const search = formdata.get("search");
    setSearchTerm(search);

    const filtered = filterListings(listings, search, activeFilter);
    setFilteredListings(filtered);
    setLoading(false);
  }

  function filterListings(items, search, filter) {
    let result = [...items];

    // Apply search filter
    if (search) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply type filter
    if (filter !== "All") {
      result = result.filter(
        (item) => item.type.toLowerCase() === filter.toLowerCase()
      );
    }

    return result;
  }

  function handleFilter(e) {
    const filter = e.target.value;
    setActiveFilter(filter);

    const filtered = filterListings(listings, searchTerm, filter);
    setFilteredListings(filtered);
  }

  function handleClear(e) {
    e.preventDefault();
    formRef.current.reset();
    setSearchTerm("");
    setActiveFilter("All");
    setFilteredListings(listings);
  }

  React.useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/listing`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setListings(data.listings);
        setFilteredListings(data.listings);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);
  return (
    <div className="m-4">
      <form
        onSubmit={(e) => handleSearch(e)}
        className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto"
        ref={formRef}
      >
        <div className="relative flex-1">
          <input
            type="text"
            name="search"
            placeholder="Enter location"
            className="w-full px-3 py-2 rounded-lg text-[#7f7f7f] shadow-input outline-0"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <IoSearchSharp className="cursor-pointer" size={24} />
          </button>
        </div>

        <div className="flex gap-2 justify-between sm:justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>

          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <label className="flex items-center gap-2 px-3 py-1 rounded cursor-pointer hover:bg-white transition-colors">
              <input
                type="radio"
                name="type"
                value="All"
                onChange={handleFilter}
                defaultChecked
                className="hidden"
              />
              <span>All</span>
            </label>
            <div className="w-[1px] bg-gray-300"></div>
            <label className="flex items-center gap-2 px-3 py-1 rounded cursor-pointer hover:bg-white transition-colors">
              <input
                type="radio"
                name="type"
                value="sale"
                onChange={handleFilter}
                className="hidden"
              />
              <span>Sale</span>
            </label>
            <div className="w-[1px] bg-gray-300"></div>
            <label className="flex items-center gap-2 px-3 py-1 rounded cursor-pointer hover:bg-white transition-colors">
              <input
                type="radio"
                name="type"
                value="rent"
                onChange={handleFilter}
                className="hidden"
              />
              <span>Rent</span>
            </label>
          </div>
        </div>
      </form>
      <div>
        {loading ? <Spinner /> : <Listings listings={filteredListings} />}
      </div>
    </div>
  );
}
