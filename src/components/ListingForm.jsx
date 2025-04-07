import { Link } from "react-router-dom";
import { storage } from "../firebase.config";
import {
  deleteObject,
  uploadBytes,
  getDownloadURL,
  ref,
} from "firebase/storage";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";

export default function ListingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      bedrooms: "1",
      bathrooms: "1",
      location: "",
      type: "rent",
      airConditioning: false,
      heating: false,
      wifi: false,
      parking: false,
      washer: false,
      dryer: false,
      pool: false,
      balcony: false,
    },
  });

  async function onSubmit(data) {
    if (!user) {
      toast.error("You must be logged in to create a listing");
      return;
    }

    setIsSubmitting(true);
    const listingID = uuidv4();
    const toastId = toast.loading("Creating your listing...");

    const images = data.images;

    if (!images || images.length === 0) {
      toast.error("At least one image is required");
      toast.dismiss(toastId);
      setIsSubmitting(false);
      return;
    }

    if (images.length >= 7) {
      toast.error("Maximum of 6 images allowed");
      toast.dismiss(toastId);
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
        toast.dismiss(toastId);
        setIsSubmitting(false);
        return;
      }

      if (image.size > maxSizeInBytes) {
        toast.error(`File "${image.name}" exceeds the maximum size of 5MB.`);
        toast.dismiss(toastId);
        setIsSubmitting(false);
        return;
      }
    }

    const uploadedFileRefs = [];
    const imageURLs = [];

    try {
      for (const image of images) {
        const filename = `${user.id}-${image.name}-${uuidv4()}`;
        const fileRef = ref(storage, `listings/${filename}`);
        const metadata = {
          customMetadata: {
            userId: user.id,
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

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/listing`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: listingID,
            title: data.title,
            description: data.description,
            type: data.type,
            price: Number(data.price),
            location: data.location,
            bathrooms: Number(data.bathrooms),
            bedrooms: Number(data.bedrooms),
            image_urls: imageURLs,
            is_air_conditioned: Boolean(data.airConditioning),
            is_heated: Boolean(data.heating),
            is_wifi_available: Boolean(data.wifi),
            is_parking_available: Boolean(data.parking),
            is_washer_available: Boolean(data.washer),
            is_dryer_available: Boolean(data.dryer),
            is_pool_available: Boolean(data.pool),
            is_balcony_available: Boolean(data.balcony),
            user_id: user.id,
          }),
        }
      );

      if (!response.ok) {
        toast.dismiss(toastId);
        toast.error("Failed to create listing");
        setIsSubmitting(false);
        return;
      }

      toast.dismiss(toastId);
      toast.success("Listing created successfully!");
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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col justify-center w-8/10 md:w-10/12 mx-auto my-4 md:my-8 max-w-[800px]">
      <h1 className="text-2xl font-bold">Create a Listing</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 md:gap-6"
      >
        <div>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-base p-0 pt-3">
              Title
            </legend>
            <input
              type="text"
              className={`input w-full ${errors.title ? "input-error" : ""}`}
              placeholder="Enter listing title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-error text-sm mt-1">{errors.title.message}</p>
            )}
          </fieldset>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-base p-0 pt-3">
              Description
            </legend>
            <textarea
              className={`input w-full min-h-20 overflow-y-scroll px-3 py-2 max-h-60 ${
                errors.description ? "input-error" : ""
              }`}
              placeholder="Enter listing description"
              wrap="soft"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-error text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </fieldset>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-base p-0 pt-3">
              Price
            </legend>
            <input
              type="number"
              className={`input w-full ${errors.price ? "input-error" : ""}`}
              placeholder="2000"
              {...register("price", {
                required: "Price is required",
                min: { value: 1, message: "Price must be a positive number" },
                valueAsNumber: true,
              })}
            />
            {errors.price && (
              <p className="text-error text-sm mt-1">{errors.price.message}</p>
            )}
          </fieldset>
          <div className="md:flex gap-4">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-base p-0 pt-3">
                Bedrooms
              </legend>
              <input
                type="number"
                className={`input w-full ${
                  errors.bedrooms ? "input-error" : ""
                }`}
                placeholder="1"
                {...register("bedrooms", {
                  required: "Bedrooms is required",
                  min: { value: 0, message: "Cannot be negative" },
                  valueAsNumber: true,
                  validate: (value) =>
                    Number.isInteger(value) || "Must be a whole number",
                })}
              />
              {errors.bedrooms && (
                <p className="text-error text-sm mt-1">
                  {errors.bedrooms.message}
                </p>
              )}
            </fieldset>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-base p-0 pt-3">
                Bathrooms
              </legend>
              <input
                type="number"
                className={`input w-full ${
                  errors.bathrooms ? "input-error" : ""
                }`}
                placeholder="1"
                {...register("bathrooms", {
                  required: "Bathrooms is required",
                  min: { value: 0, message: "Cannot be negative" },
                  valueAsNumber: true,
                })}
              />
              {errors.bathrooms && (
                <p className="text-error text-sm mt-1">
                  {errors.bathrooms.message}
                </p>
              )}
            </fieldset>
          </div>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-base p-0 pt-3">
              Location
            </legend>
            <input
              type="text"
              className={`input w-full ${errors.location ? "input-error" : ""}`}
              placeholder="Enter listing location"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <p className="text-error text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </fieldset>
        </div>
        <div>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-base">Type</legend>
            <div className="flex w-24 justify-between my-1 items-center">
              <label htmlFor="for-rent" className="cursor-pointer text-base">
                For Rent
              </label>
              <input
                id="for-rent"
                type="radio"
                value="rent"
                className="radio radio-sm radio-neutral"
                {...register("type")}
              />
            </div>
            <div className="flex w-24 justify-between items-center">
              <label htmlFor="for-sale" className="cursor-pointer text-base">
                For Sale
              </label>
              <input
                id="for-sale"
                type="radio"
                value="sale"
                className="radio radio-sm radio-neutral"
                {...register("type")}
              />
            </div>
          </fieldset>
          <div className="mt-2">
            <div className="font-semibold mb-1">Amenities</div>
            <div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="airConditioning"
                  {...register("airConditioning")}
                />
                <label htmlFor="airConditioning" className="cursor-pointer">
                  Air Conditioning
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="heating"
                  {...register("heating")}
                />
                <label htmlFor="heating" className="cursor-pointer">
                  Heating
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="wifi"
                  {...register("wifi")}
                />
                <label htmlFor="wifi" className="cursor-pointer">
                  Wifi
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="parking"
                  {...register("parking")}
                />
                <label htmlFor="parking" className="cursor-pointer">
                  Parking
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="washer"
                  {...register("washer")}
                />
                <label htmlFor="washer" className="cursor-pointer">
                  Washer
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="dryer"
                  {...register("dryer")}
                />
                <label htmlFor="dryer" className="cursor-pointer">
                  Dryer
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="pool"
                  {...register("pool")}
                />
                <label htmlFor="pool" className="cursor-pointer">
                  Pool
                </label>
              </div>
              <div className="flex gap-1 mb-[2px] items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-neutral mr-1"
                  id="balcony"
                  {...register("balcony")}
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
                accept="image/png, image/jpeg, image/webp, image/gif"
                multiple
                className={`file-input file-input-neutral w-full ${
                  errors.images ? "file-input-error" : ""
                }`}
                {...register("images", {
                  required: "At least one image is required",
                })}
              />
              {errors.images && (
                <p className="text-error text-sm mt-1">
                  {errors.images.message}
                </p>
              )}
            </fieldset>
          </div>
        </div>
        <div className="flex justify-between items-center gap-4 mt-2">
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Listing"}
          </button>
          <Link to="/" className="btn btn-soft btn-error">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
