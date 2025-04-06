import React from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";

function Starred() {
  const [bookmarks, setBookmarks] = React.useState([]);
  const [bookmarkedListings, setBookmarkedListings] = React.useState([]);
  const { user } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);

  async function getBookmarkedListings() {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/bookmark`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
        setBookmarkedListings(data);
      } else {
        const data = await response.json();
        toast.error(data.error || "An error occured");
      }
    } catch (error) {
      toast.error(error.message || "An error occured");
    } finally {
      setLoading(false);
    }
  }

  async function deleteBookmark(listingID) {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/bookmark/${listingID}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        getBookmarkedListings();
      } else {
        const data = await response.json();
        toast.error(data.error || "An error occured");
      }
    } catch (error) {
      toast.error(error.message || "An error occured");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (user) {
      getBookmarkedListings();
    }
  }, [user]);

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return (
      <div className="text-center mt-6 lg:text-lg">
        Please{" "}
        <Link to="/login" className="text-[#009a88]">
          login
        </Link>{" "}
        to view your bookmarks
      </div>
    );
  }

  let bookmarksEl;
  if (bookmarkedListings.length > 0) {
    bookmarksEl = bookmarkedListings.map((listing) => {
      return (
        <li
          className="flex items-center gap-2 sm:gap-4 p-2 sm:p-4 border-b border-gray-200 last:border-b-0"
          key={listing.id}
        >
          <img
            src={listing.image_urls[0]}
            alt={listing.title}
            className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg mb-1">
              {listing.title}
            </h3>
            <p className="text-gray-600 truncate text-sm sm:text-base">
              {listing.description}
            </p>
          </div>
          <Link
            to={`/listings/${listing.id}`}
            className="shrink-0 px-2 py-1 sm:px-3 text-sm sm:text-base bg-[#009a88] text-white rounded hover:bg-[#008577] transition-colors"
          >
            View
          </Link>
          <button
            className="shrink-0 px-2 py-1 sm:px-3 text-sm sm:text-base bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={() => deleteBookmark(listing.id)}
          >
            Delete
          </button>
        </li>
      );
    });
  }

  return (
    <div>
      {bookmarks.length === 0 ? (
        <div className="text-center mt-6">No bookmarks yet</div>
      ) : (
        <ul className="list my-4 px-3">{bookmarksEl}</ul>
      )}
    </div>
  );
}

export default Starred;
