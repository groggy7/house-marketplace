import avatar from "../assets/avatar.png";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import React from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

export default function Personal() {
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);
  const { user, loading } = React.useContext(AuthContext);
  const [displaySaveBtn, setDisplaySaveBtn] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [previewImage, setPreviewImage] = React.useState(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  function handleClick(e) {
    e.preventDefault();
    fileInputRef.current.click();
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setDisplaySaveBtn(true);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!displaySaveBtn) return;

    setIsUpdating(true);
    const toastId = toast.loading("Updating profile...");

    const formdata = new FormData(e.target);
    const fullName = formdata.get("name");
    const regex = /^\s*([a-zA-Z]+)\s+([a-zA-Z]+)\s*$/;

    if (fullName && !regex.test(fullName)) {
      toast.dismiss(toastId);
      toast.error("Enter a valid name");
      setIsUpdating(false);
      return;
    }

    try {
      let avatarKey = null;

      if (selectedFile) {
        const presignedUrlRes = await fetch(
          `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/upload/avatar`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: user.id,
              content_type: selectedFile.type,
            }),
          }
        );

        if (!presignedUrlRes.ok) {
          throw new Error("Failed to get upload URL.");
        }

        const { url, key } = await presignedUrlRes.json();
        avatarKey = key;

        const uploadResponse = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": selectedFile.type,
          },
          body: selectedFile,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image.");
        }
      }

      const updateData = {};
      if (avatarKey) {
        updateData.avatar_key = user.id;
      }
      if (fullName) {
        updateData.full_name = fullName;
      }

      if (Object.keys(updateData).length > 0) {
        if (!updateData.full_name) {
          updateData.full_name = user.full_name;
        }

        console.log("Data being sent to /user/info:", updateData);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/user/info`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update profile.");
        }
        
        await response.json();
      } else {
        toast.dismiss(toastId);
        setDisplaySaveBtn(false);
        setIsUpdating(false);
        return;
      }

      toast.dismiss(toastId);
      toast.success("Profile updated successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || "An error occurred during update.");
      setIsUpdating(false);
      setDisplaySaveBtn(false);
    }
  }

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {isUpdating && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
      <div className="p-8 w-full max-w-200 mx-auto">
        <div>
          <div
            className="flex gap-1 items-center cursor-pointer hover:text-[#009a88] transition-colors
            hover:font-bold m-3 lg:my-0"
            onClick={() => navigate("/profile")}
          >
            <IoIosArrowBack fontSize={20} />
            <span>Back</span>
          </div>
        </div>
        <form
          className="shadow-[0px_2px_10px_rgba(3,3,3,0.1)] rounded-lg flex gap-4 mt-8 py-6 px-8 relative"
          onChange={() => setDisplaySaveBtn(true)}
          onSubmit={handleSubmit}
        >
          <button
            type="submit"
            className={`bg-[#009a88] text-white py-1 px-3 rounded-lg hover:bg-[#2b5e57] 
            transition-colors absolute right-8 top-4 ${
              displaySaveBtn ? "" : "hidden"
            }`}
          >
            Save
          </button>
          <div className="flex flex-col justify-center items-center gap-4">
            <img
              src={previewImage || (user.avatar_key ? `${import.meta.env.VITE_R2_STORAGE}/${user.avatar_key}` : avatar)}
              alt="profile picture"
              className="w-24 h-24 object-cover rounded-full mx-auto"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              name="avatar"
              max={1}
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="px-2 py-1 bg-[#009a88] text-white rounded-lg hover:bg-[#008577] transition-colors self-center"
              onClick={handleClick}
            >
              Change photo
            </button>
          </div>
          <div className="w-[2px] bg-[#e5e5e5]"></div>
          <div className="flex-1">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Full Name</legend>
              <input
                type="text"
                className="input w-full"
                placeholder={user.full_name}
                name="name"
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">
                Email Address
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder={user.email}
                disabled
              />
            </fieldset>
          </div>
        </form>
      </div>
    </>
  );
}
