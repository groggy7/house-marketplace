import React from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa6";
import circle from "../assets/circle.svg";
import { IoBedSharp } from "react-icons/io5";
import { BiSolidBath, BiSolidDryer, BiSolidWasher } from "react-icons/bi";
import { LuSnowflake } from "react-icons/lu";
import { FaHotjar, FaParking } from "react-icons/fa";
import { IoIosWifi } from "react-icons/io";
import { MdBalcony, MdPool } from "react-icons/md";
import ImageSlider from "../components/ImageSlider";

export default function ListingDetail() {
  const [loading, setLoading] = React.useState(true);
  const [listing, setListing] = React.useState(null);

  const params = useParams();
  const listingID = params.listingID;

  React.useEffect(() => {
    async function getListing() {
      const ref = doc(db, "listings", listingID);
      try {
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
          setListing(docSnap.data());
        } else {
          toast.error("listing does not exist");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getListing();
  }, [listingID]);

  return loading ? (
    <Spinner />
  ) : (
    <div className="text-[#333333] lg:px-8 lg:py-6 lg:flex lg:flex-col lg:gap-4 max-w-[1400px] mx-auto">
      <div className="lg:flex lg:gap-8">
        <div className="lg:w-[65%]">
          <div className="-mx-4 lg:mx-0">
            <ImageSlider images={listing.imageURLs} />
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
            {listing.isAirConditioned ? (
              <div className="flex gap-2 items-center mb-2">
                <LuSnowflake size={18} />
                <span>Air Conditioning</span>
              </div>
            ) : null}
            {listing.isWifiAvailable ? (
              <div className="flex gap-2 items-center mb-2">
                <IoIosWifi size={18} />
                <span>Wifi</span>
              </div>
            ) : null}
            {listing.isHeated ? (
              <div className="flex gap-2 items-center mb-2">
                <FaHotjar size={18} />
                <span>Heated</span>
              </div>
            ) : null}
            {listing.isParkingAvailable ? (
              <div className="flex gap-2 items-center mb-2">
                <FaParking size={18} />
                <span>Parking</span>
              </div>
            ) : null}
            {listing.isWasherAvailable ? (
              <div className="flex gap-2 items-center mb-2">
                <BiSolidWasher size={18} />
                <span>Washer</span>
              </div>
            ) : null}
            {listing.isDryerAvailable ? (
              <div className="flex gap-2 items-center mb-2">
                <BiSolidDryer size={18} />
                <span>Dryer</span>
              </div>
            ) : null}
            {listing.isBalconyAvailable ? (
              <div className="flex gap-2 items-center mb-2">
                <MdBalcony size={18} />
                <span>Balcony</span>
              </div>
            ) : null}
            {listing.isPoolAvailable ? (
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
            <button className="bg-[#009a88] text-white rounded-lg w-full py-2 cursor-pointer">
              Reserve
            </button>
            <button className="bg-[#ff6e5d] text-white rounded-lg w-full py-2 cursor-pointer">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
