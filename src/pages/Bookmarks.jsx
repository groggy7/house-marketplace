import React from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase.config";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";

function Starred() {
  const [bookmarks, setBookmarks] = React.useState([]);
  const [bookmarkedListings, setBookmarkedListings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        getBookmarkedListings();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function getBookmarkedListings() {
    try {
      setLoading(true);
      const bookmarkSnap = await getDoc(
        doc(db, "bookmarks", auth.currentUser.uid)
      );

      if (bookmarkSnap.exists()) {
        const bookmarkData = bookmarkSnap.data();
        setBookmarks(bookmarkData.listingIDs || []);
        if (bookmarkData.listingIDs) {
          for (let i = 0; i < bookmarkData.listingIDs.length; i++) {
            const listingSnap = await getDoc(
              doc(db, "listings", bookmarkData.listingIDs[i])
            );
            if (listingSnap.exists()) {
              setBookmarkedListings((prev) => [...prev, listingSnap.data()]);
            }
          }
        }
      } else {
        setBookmarks([]);
      }
    } catch (error) {
      toast.error(error.message);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteBookmark(listingID) {
    const remainingBookmarks = bookmarks.filter(
      (bookmark) => bookmark !== listingID
    );
    try {
      setLoading(true);
      await updateDoc(doc(db, "bookmarks", auth.currentUser.uid), {
        listingIDs: remainingBookmarks,
      });
      setBookmarks(remainingBookmarks);
      setBookmarkedListings((prev) =>
        prev.filter((listing) => listing.id !== listingID)
      );
    } catch (error) {
      toast.error(error.message || "An error occured");
    } finally {
      setLoading(false);
    }
  }

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
            src={listing.imageURLs[0]}
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
