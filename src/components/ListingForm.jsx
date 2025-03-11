import { Link } from "react-router-dom";
import { auth, db, storage } from "../firebase.config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import {
  deleteObject,
  uploadBytes,
  getDownloadURL,
  ref,
} from "firebase/storage";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ListingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  const pendingSubmissions = new Set();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const submissionID = uuidv4();

    const formdata = new FormData(formRef.current);

    if (pendingSubmissions.has(submissionID)) {
      return;
    }
    pendingSubmissions.add(submissionID);

    try {
      const title = formdata.get("title");
      if (!title || title.trim() === "") {
        toast.error("Title is required");
        setIsSubmitting(false);
        return;
      }

      const description = formdata.get("description");
      if (!description || description.trim() === "") {
        toast.error("Description is required");
        setIsSubmitting(false);
        return;
      }

      const price = Number(formdata.get("price"));
      if (isNaN(price) || price <= 0) {
        toast.error("Price must be a valid positive number");
        setIsSubmitting(false);
        return;
      }

      const bedrooms = Number(formdata.get("bedrooms"));
      if (isNaN(bedrooms) || bedrooms < 0 || !Number.isInteger(bedrooms)) {
        toast.error("Bedrooms must be a valid non-negative integer");
        setIsSubmitting(false);
        return;
      }

      const bathrooms = Number(formdata.get("bathrooms"));
      if (isNaN(bathrooms) || bathrooms < 0) {
        toast.error("Bathrooms must be a valid non-negative number");
        setIsSubmitting(false);
        return;
      }

      const location = formdata.get("location");
      if (!location || location.trim() === "") {
        toast.error("Location is required");
        setIsSubmitting(false);
        return;
      }

      const type = formdata.get("type");
      if (!type || type.trim() === "") {
        toast.error("Property type is required");
        setIsSubmitting(false);
        return;
      }

      const isAirConditioned = Boolean(formdata.get("air-conditioning"));
      const isHeated = Boolean(formdata.get("heating"));
      const isWifiAvailable = Boolean(formdata.get("wifi"));
      const isParkingAvailable = Boolean(formdata.get("parking"));
      const isWasherAvailable = Boolean(formdata.get("washer"));
      const isDryerAvailable = Boolean(formdata.get("dryer"));
      const isPoolAvailable = Boolean(formdata.get("pool"));
      const isBalconyAvailable = Boolean(formdata.get("balcony"));

      const images = formdata.getAll("images");

      if (!images || images.length === 0) {
        toast.error("At least one image is required");
        setIsSubmitting(false);
        return;
      }

      if (images.length >= 7) {
        toast.error("Maximum of 6 images allowed");
        setIsSubmitting(false);
        return;
      }

      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      const maxSizeInBytes = 5 * 1024 * 1024;

      for (const image of images) {
        if (!validImageTypes.includes(image.type)) {
          toast.error(
            `Include at least one image. \n Please use JPEG, PNG, WebP, or GIF formats.`
          );
          setIsSubmitting(false);
          return;
        }

        if (image.size > maxSizeInBytes) {
          toast.error(`File "${image.name}" exceeds the maximum size of 5MB.`);
          setIsSubmitting(false);
          return;
        }
      }

      if (!auth.currentUser) {
        toast.error("You must be logged in to create a listing");
        setIsSubmitting(false);
        return;
      }

      const listingID = uuidv4();

      const toastId = toast.loading("Creating your listing...");

      const uploadedFileRefs = [];
      const imageURLs = [];

      try {
        for (const image of images) {
          const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
          const fileRef = ref(storage, `listings/${filename}`);
          const metadata = {
            customMetadata: {
              userId: auth.currentUser.uid,
              uploadedAt: new Date().toISOString(),
              fileName: image.name,
              listingId: listingID,
              contentType: image.type,
            },
          };

          await uploadBytes(fileRef, image, metadata);

          uploadedFileRefs.push(fileRef);
          const downloadURL = await getDownloadURL(fileRef);
          imageURLs.push(downloadURL);
        }

        await setDoc(doc(db, "listings", listingID), {
          id: listingID,
          title,
          description,
          price,
          bedrooms,
          bathrooms,
          location,
          type,
          isAirConditioned,
          isHeated,
          isWifiAvailable,
          isParkingAvailable,
          isWasherAvailable,
          isDryerAvailable,
          isPoolAvailable,
          isBalconyAvailable,
          imageURLs,
          userRef: auth.currentUser.uid,
          createdAt: serverTimestamp(),
        });

        if (formRef && formRef.current) {
          formRef.current.reset();
        }

        toast.dismiss(toastId);
        toast.success("Listing created successfully!");
        setIsSubmitting(false);
        navigate(-1);
      } catch (error) {
        toast.dismiss(toastId);
        toast.error(error.message || "An error occurred");

        try {
          await Promise.all(
            uploadedFileRefs.map((fileRef) => deleteObject(fileRef))
          );
        } catch (cleanupError) {
          console.error("Error cleaning up files:", cleanupError);
        }

        setIsSubmitting(false);
        return;
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  }
  return (
    <div className="flex flex-col justify-center w-8/10 md:w-10/12 mx-auto my-4 md:my-8 max-w-[800px]">
      <h1 className="text-2xl font-bold">Create a Listing</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 md:gap-6"
        ref={formRef}
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
          <button className="btn btn-primary flex-1" disabled={isSubmitting}>
            {isSubmitting ? <>Creating...</> : "Create Listing"}
          </button>
          <Link to="/" className="btn btn-soft btn-error">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
