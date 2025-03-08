import { IoSearchSharp } from "react-icons/io5";
import { collection, getDocs } from "firebase/firestore";
import React from "react";
import { db } from "../firebase.config";
import Listings from "../components/Listings";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";

export default function Search() {
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "listings"));
        querySnapshot.forEach((doc) => {
          setListings(Array.isArray(doc.data()) ? doc.data() : [doc.data()]);
        });
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
      <Link to="/create-listing">Create Listing</Link>
      <div>{loading ? <Spinner /> : <Listings listings={listings} />}</div>
    </div>
  );
}
