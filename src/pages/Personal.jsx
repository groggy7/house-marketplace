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
    setIsUpdating(true);
    const formdata = new FormData(e.target);

    const fullName = formdata.get("name");
    const regex = /^\s*([a-zA-Z]+)\s+([a-zA-Z]+)\s*$/;
    if (fullName && !regex.test(fullName)) {
      toast.error("Enter a valid name");
      setIsUpdating(false);
      return;
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", "avatars");

      const uploadResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/file`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        toast.error("Failed to upload image");
        setIsUpdating(false);
        return;
      }

      const { url } = await uploadResponse.json();

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/user`,
        {
          method: "PUT",
          body: JSON.stringify({
            avatar_url: url,
            full_name: fullName || user.full_name,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Profile updated");
      } else {
        toast.error("Failed to update profile");
      }
      window.location.reload();
    } else {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/user`,
        {
          method: "PUT",
          body: JSON.stringify({
            full_name: fullName,
          }),
          credentials: "include",
        }
      );
      if (response.ok) {
        toast.success("Profile updated");
      } else {
        toast.error("Failed to update profile");
      }
      window.location.reload();
    }

    setDisplaySaveBtn(false);
    setIsUpdating(false);
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
              src={previewImage || user.avatar_url || avatar}
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
