import { Link } from "react-router-dom";
import { auth, db } from "../firebase.config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export default function ListingForm() {
  function handleAction(formdata) {
    const title = formdata.get("title");
    const description = formdata.get("description");
    const price = Number(formdata.get("price"));
    const bedrooms = Number(formdata.get("bedrooms"));
    const bathrooms = Number(formdata.get("bathrooms"));
    const location = formdata.get("location");
    const type = formdata.get("type");
    const isAirConditioned = formdata.get("air-conditioning") ? true : false;
    const isHeated = formdata.get("heating") ? true : false;
    const isWifiAvailable = formdata.get("wifi") ? true : false;
    const isParkingAvailable = formdata.get("parking") ? true : false;
    const isWasherAvailable = formdata.get("washer") ? true : false;
    const isDryerAvailable = formdata.get("dryer") ? true : false;
    const isPoolAvailable = formdata.get("pool") ? true : false;
    const isBalconyAvailable = formdata.get("balcony") ? true : false;
    //const images = formdata.get("images");

    setDoc(doc(db, "listings", uuidv4()), {
      id: uuidv4(),
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      location,
      type,
      isAirConditioned: isAirConditioned || false,
      isHeated: isHeated || false,
      isWifiAvailable: isWifiAvailable || false,
      isParkingAvailable: isParkingAvailable || false,
      isWasherAvailable: isWasherAvailable || false,
      isDryerAvailable: isDryerAvailable || false,
      isPoolAvailable: isPoolAvailable || false,
      isBalconyAvailable: isBalconyAvailable || false,
      imageURLs: ["https://example.com/img1", "https://example.com/img2"],
      userRef: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    })
      .then(() => {
        toast.success("Listing created successfully");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  return (
    <div className="flex flex-col justify-center w-8/10 md:w-10/12 mx-auto my-4 md:my-8 max-w-[800px]">
      <h1 className="text-2xl font-bold">Create a Listing</h1>
      <form
        action={handleAction}
        className="grid grid-cols-1 md:grid-cols-2 md:gap-6"
      >
        <div>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-base p-0 pt-3">
              Title
            </legend>
            <input
              type="text"
              name="title"
              className="input w-full"
              placeholder="Enter listing title"
              required
            />
          </fieldset>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-base p-0 pt-3">
              Description
            </legend>
            <textarea
              type="text"
              name="description"
              className="input w-full validator min-h-20 overflow-y-scroll px-3 py-2 max-h-60"
              placeholder="Enter listing description"
              wrap="soft"
              required
            />
          </fieldset>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-base p-0 pt-3">
              Price
            </legend>
            <input
              type="number"
              name="price"
              className="input validator w-full"
              required
              placeholder="2000"
              min="1"
            />
          </fieldset>
          <div className="md:flex gap-4">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-base p-0 pt-3">
                Bedrooms
              </legend>
              <input
                type="number"
                name="bedrooms"
                className="input validator w-full"
                placeholder="1"
                min="1"
              />
            </fieldset>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-base p-0 pt-3">
                Bathrooms
              </legend>
              <input
                type="number"
                name="bathrooms"
                className="input validator w-full"
                placeholder="1"
                min="1"
              />
            </fieldset>
          </div>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-base p-0 pt-3">
              Location
            </legend>
            <input
              type="text"
              name="location"
              className="input w-full"
              placeholder="Enter listing location"
            />
          </fieldset>
        </div>
        <div>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-base">Type</legend>
            <div className="flex w-24 justify-between my-1 items-center">
              <label htmlFor="rent" className="cursor-pointer text-base">
                For Rent
              </label>
              <input
                id="for-rent"
                type="radio"
                name="type"
                value="rent"
                className="radio radio-sm radio-neutral"
                defaultChecked
              />
            </div>
            <div className="flex w-24 justify-between items-center">
              <label htmlFor="sale" className="cursor-pointer text-base">
                For Sale
              </label>
              <input
                id="for-sale"
                type="radio"
                name="type"
                value="sale"
                className="radio radio-sm radio-neutral"
              />
            </div>
          </fieldset>
          <div className="mt-2">
            <div className="font-semibold mb-1">Amenities</div>
            <div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  name="air-conditioning"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="air-conditioning"
                />
                <label htmlFor="air-conditioning" className="cursor-pointer">
                  Air Conditioning
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  name="heating"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="heating"
                />
                <label htmlFor="heating" className="cursor-pointer">
                  Heating
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  name="wifi"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="wifi"
                />
                <label htmlFor="wifi" className="cursor-pointer">
                  Wifi
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  name="parking"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="parking"
                />
                <label htmlFor="parking" className="cursor-pointer">
                  Parking
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  name="washer"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="washer"
                />
                <label htmlFor="washer" className="cursor-pointer">
                  Washer
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  name="dryer"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="dryer"
                />
                <label htmlFor="dryer" className="cursor-pointer">
                  Dryer
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  name="pool"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="pool"
                />
                <label htmlFor="pool" className="cursor-pointer">
                  Pool
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  name="balcony"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="balcony"
                />
                <label htmlFor="balcony" className="cursor-pointer">
                  Balcony
                </label>
              </div>
            </div>
          </div>
          <div className="block">
            <fieldset className="fieldset w-full mt-2">
              <legend className="fieldset-legend text-base">Images</legend>
              <input
                id="file"
                type="file"
                name="images"
                accept="image/png, image/jpeg"
                multiple
                max="10"
                className="file-input file-input-neutral w-full"
              />
            </fieldset>
          </div>
        </div>
        <div className="flex justify-between items-center gap-4 mt-2">
          <button className="btn btn-primary flex-1">Create Listing</button>
          <Link to="/" className="btn btn-soft btn-error">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
