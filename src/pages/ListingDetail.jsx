import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa6";
import circle from "../assets/circle.svg";
import { IoBedSharp, IoBookmark } from "react-icons/io5";
import { BiSolidBath, BiSolidDryer, BiSolidWasher } from "react-icons/bi";
import { LuSnowflake } from "react-icons/lu";
import { FaHotjar, FaParking } from "react-icons/fa";
import { IoIosArrowBack, IoIosWifi } from "react-icons/io";
import { MdBalcony, MdPool } from "react-icons/md";
import ImageSlider from "../components/ImageSlider";
import { AuthContext } from "../context/AuthContext";

export default function ListingDetail() {
  const [loading, setLoading] = React.useState(true);
  const [listing, setListing] = React.useState(null);
  const { user, isAuthenticated } = React.useContext(AuthContext);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const listingID = params.listingID;

  React.useEffect(() => {
    async function getListing() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/listing/${listingID}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getListing();
  }, [listingID]);

  async function handleDeleteConfirm() {
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/listing/${listingID}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      toast.success("Listing deleted successfully");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete listing");
    } finally {
      setLoading(false);
    }
  }

  async function addToBookmarks(listingID) {
    if (isAuthenticated) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/bookmark/${listingID}`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        const data = await response.json();
        toast.success("Listing added to bookmarks");
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("You must be logged in to bookmark a listing");
    }
  }

  async function handleContact() {
    if (!isAuthenticated) {
      toast.error("You must be logged in to contact the owner");
      return;
    }

    try {
      const roomsResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/room`,
        {
          credentials: "include",
        }
      );

      if (roomsResponse.ok) {
        const rooms = await roomsResponse.json();
        const existingRoom = rooms.find(
          (room) => room.property_id === listingID
        );

        if (existingRoom) {
          navigate("/inbox");
          return;
        }
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/room`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            property_id: listingID,
            owner_id: listing.user_id,
          }),
        }
      );

      if (response.ok) {
        navigate("/inbox");
      } else {
        console.error("Failed to create chat room");
        toast.error("Failed to create chat room");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create chat room");
    }
  }

  return loading ? (
    <Spinner />
  ) : (
    <div className="text-[#333333] lg:px-8 lg:py-6 lg:flex lg:flex-col lg:gap-4 mx-auto overflow-hidden">
      <div className="flex justify-between items-center">
        <div
          className="flex gap-1 items-center cursor-pointer hover:text-[#009a88] transition-colors
          hover:font-bold m-3 lg:my-0"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack fontSize={20} />
          <span>Back</span>
        </div>
        <div>
          {user?.id === listing.user_id ? (
            <button
              className="btn btn-outline btn-error my-2 mr-3 sm:mr-0"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Listing
            </button>
          ) : null}
          {isAuthenticated && user?.id !== listing.user_id ? (
            <IoBookmark
              fill="#009a88"
              size={32}
              className="hover:cursor-pointer hover:fill-[#007a73] transition-colors mr-3"
              onClick={() => addToBookmarks(listingID)}
            />
          ) : null}
        </div>
      </div>
      <div className="lg:flex lg:gap-8">
        <div className="lg:w-[65%]">
          <div className="-mx-4 lg:mx-0">
            <ImageSlider images={listing.image_keys} />
          </div>
          <div className="px-4 lg:px-0">
            <h1 className="text-2xl lg:text-3xl mt-4">{listing.title}</h1>
            <div className="flex gap-4 items-center my-2">
              <div className="flex gap-2 items-center">
                <FaStar fill="#ffc107" />
                <span>4,1/5</span>
              </div>
              <div className="flex gap-2 items-center">
                <img src={circle} alt="reviews" />
                <span>10 reviews</span>
              </div>
            </div>
            <div className="flex gap-2 text-[#7f7f7f] font-light mb-4">
              <div className="bg-[#f5f5f5] flex gap-2 items-center px-2 py-1 rounded-lg">
                <IoBedSharp fill="#7f7f7f" />
                <span>
                  {listing.bedrooms} {listing.bedrooms === 1 ? "bed" : "beds"}
                </span>
              </div>
              <div className="bg-[#f5f5f5] flex gap-2 items-center px-2 py-1 rounded-lg">
                <BiSolidBath fill="#7f7f7f" />
                <span>
                  {listing.bathrooms}{" "}
                  {listing.bathrooms === 1 ? "bath" : "baths"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-[35%] px-4 lg:px-0">
          <div>
            <h2 className="font-bold lg:text-lg">Description</h2>
            <p className="mt-2">{listing.description}</p>
          </div>
          <div className="divider" />
          <div>
            <h3 className="font-bold mb-3 lg:text-lg">Amenities</h3>
            {listing.is_air_conditioned ? (
              <div className="flex gap-2 items-center mb-2">
                <LuSnowflake size={18} />
                <span>Air Conditioning</span>
              </div>
            ) : null}
            {listing.is_wifi_available ? (
              <div className="flex gap-2 items-center mb-2">
                <IoIosWifi size={18} />
                <span>Wifi</span>
              </div>
            ) : null}
            {listing.is_heated ? (
              <div className="flex gap-2 items-center mb-2">
                <FaHotjar size={18} />
                <span>Heated</span>
              </div>
            ) : null}
            {listing.is_parking_available ? (
              <div className="flex gap-2 items-center mb-2">
                <FaParking size={18} />
                <span>Parking</span>
              </div>
            ) : null}
            {listing.is_washer_available ? (
              <div className="flex gap-2 items-center mb-2">
                <BiSolidWasher size={18} />
                <span>Washer</span>
              </div>
            ) : null}
            {listing.is_dryer_available ? (
              <div className="flex gap-2 items-center mb-2">
                <BiSolidDryer size={18} />
                <span>Dryer</span>
              </div>
            ) : null}
            {listing.is_balcony_available ? (
              <div className="flex gap-2 items-center mb-2">
                <MdBalcony size={18} />
                <span>Balcony</span>
              </div>
            ) : null}
            {listing.is_pool_available ? (
              <div className="flex gap-2 items-center mb-2">
                <MdPool size={18} />
                <span>Pool</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="px-4 py-3 md:px-6 md:py-4 lg:p-0">
        <div className="divider" />
        <div className="flex flex-col gap-2">
          <p>
            <span className="text-[#009a88] font-bold">${listing.price}</span>{" "}
            {listing.type === "rent" ? "/month" : null}
          </p>
          <div className="flex gap-6">
            <button
              className={`bg-[#009a88] text-white rounded-lg w-full py-2 ${
                user?.id === listing.user_id
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={user?.id === listing.user_id}
            >
              Reserve
            </button>
            <button
              className={`bg-[#ff6e5d] text-white rounded-lg w-full py-2 ${
                user?.id === listing.user_id
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:bg-[#ff5c4a] transition-colors"
              }`}
              onClick={handleContact}
              disabled={user?.id === listing.user_id}
            >
              Contact
            </button>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Delete Listing</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
