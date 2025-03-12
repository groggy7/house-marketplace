import avatar from "../assets/avatar.png";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import React from "react";
import { AuthContext } from "../context/AuthContext";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase.config";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
export default function Personal() {
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);
  const { user, setUser, loading: authLoading } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(true);
  const [userInfo, setUserInfo] = React.useState(null);
  const [displaySaveBtn, setDisplaySaveBtn] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [previewImage, setPreviewImage] = React.useState(null);

  React.useEffect(() => {
    if (authLoading) {
      return;
    }
    if (user === null) {
      navigate("/login");
      return;
    }

    async function fetchUser() {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.id));
        setUserInfo({
          id: user.id,
          email: user.email,
          name: userDoc.data().name,
          avatarURL: userDoc.data().avatarURL,
        });
      } catch (error) {
        toast.error(error.message || "An error occurred");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [navigate, user, authLoading]);

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

  function handleSubmit(e) {
    e.preventDefault();
    const formdata = new FormData(e.target);

    const fullName = formdata.get("name");
    const regex = /^\s*([a-zA-Z]+)\s+([a-zA-Z]+)\s*$/;
    if (fullName && !regex.test(fullName)) {
      toast.error("Enter a valid name");
      return;
    }

    try {
      if (selectedFile) {
        const metadata = {
          contentType: selectedFile.type,
          userId: user.id,
        };

        const storageRef = ref(
          storage,
          `avatars/${selectedFile.name}`,
          metadata
        );
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            toast.success(`Upload is ${progress}% done`);
          },
          (error) => {
            toast.error(error.message || "An error occurred");
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const docRef = doc(db, "users", user.id);
              updateDoc(docRef, {
                ...userInfo,
                name: fullName || userInfo.name,
                avatarURL: downloadURL,
              });
              setUser({
                ...userInfo,
                name: fullName || userInfo.name,
                avatar: downloadURL,
              });
            });
          }
        );
      } else {
        const docRef = doc(db, "users", user.id);
        updateDoc(docRef, {
          name: fullName,
        });
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
      console.log(error);
    }

    setDisplaySaveBtn(false);
  }

  if (authLoading || loading) {
    return <Spinner />;
  }

  if (!user) {
    return null;
  }

  if (!userInfo) {
    return <Spinner />;
  }

  return (
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
            src={previewImage || userInfo.avatarURL || avatar}
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
              placeholder={userInfo.name}
              name="name"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base">Email Address</legend>
            <input
              type="text"
              className="input w-full"
              placeholder={userInfo.email}
              disabled
            />
          </fieldset>
        </div>
      </form>
    </div>
  );
}
