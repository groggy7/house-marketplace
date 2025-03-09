import PropTypes from "prop-types";
import { BiSolidBath } from "react-icons/bi";
import { FaStar } from "react-icons/fa6";
import { IoBedSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function Listings({ listings }) {
  const listingsEl = listings.map((listing) => {
    return (
      <Link
        to={`/listings/${listing.id}`}
        key={listing.id}
        className="flex flex-col rounded-lg shadow-card m-4"
      >
        <img
          src={listing.imageURLs[0]}
          alt={listing.name}
          className="w-100 rounded-lg"
        />
        <div className="p-3">
          <div className="flex justify-between">
            <span className="font-bold">{listing.name}</span>
            <div className="flex gap-2 items-center">
              <FaStar fill="#ffc107" />
              <span>4,7/5</span>
            </div>
          </div>
          <div className="flex gap-4 text-[#7f7f7f]">
            <div className="flex gap-2 items-center">
              <IoBedSharp fill="#7f7f7f" />
              {listing.bedrooms}
            </div>
            <div className="flex gap-2 items-center">
              <BiSolidBath fill="#7f7f7f" />
              {listing.bathrooms}
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[#009a88] font-bold mr-1">
                ${listing.price}
              </span>
              total
            </div>
            <button className="cursor-pointer text-white bg-[#009a88] px-3 py-[2px] rounded-sm">
              View
            </button>
          </div>
        </div>
      </Link>
    );
  });

  return (
    <div className="mt-6 grid md:grid-cols-[repeat(auto-fill,400px)] grid-cols-[repeat(auto-fill,300px)]">
      {listingsEl}
    </div>
  );
}

Listings.propTypes = {
  listings: PropTypes.array.isRequired,
};
