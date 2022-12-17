import React, { useState } from "react";
import {
  AiOutlineMessage,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { userData } from "../slices/userSlice";
import { getAuth, updateProfile, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getStorage,
  uploadString,
  getDownloadURL,
  ref,
} from "firebase/storage";
import {
  getDatabase,
  child,
  push,
  ref as updateRef,
  update,
} from "firebase/database";
import { ThreeDots } from "react-loader-spinner";

const Sidbar = () => {
  const storage = getStorage();
  const db = getDatabase();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  let data = useSelector((state) => state.userData.userInfo);
  let [show, setShow] = useState(false);
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    //console.log("logout clicked");

    signOut(auth)
      .then(() => {
        dispatch(userData(null));
        localStorage.removeItem("userInfo");
        navigate("/login");
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  //Profile pic
  const handleClickProfile = () => {
    console.log("profile pic clicked");
    setShow(true);
  };

  const handleImageUploadChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      setLoading(true);
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        // console.log("Uploaded a data_url string!");
        getDownloadURL(storageRef)
          .then((downloadURL) => {
            const postData = {
              // username: data.displayName,
              // email: data.email,
              photoURL: downloadURL,
            };
            console.log(auth.currentUser.uid);

            update(updateRef(db, "users/" + data.uid), postData);
            updateProfile(auth.currentUser, {
              photoURL: downloadURL,
            }).then(() => {
              setShow(false);
              setImage("");
              setCropData("");
              setCropper("");
              setLoading(false);
            });
          })
          .catch((error) => {
            // An error occurred
            // ...
            console.log(error);
          });
      });
    }
  };
  const handleUpload = () => {
    getCropData();
  };
  const handleCancel = () => {
    setShow(false);
    setImage("");
    setCropData("");
    setCropper("");
  };

  return (
    <>
      {show && (
        <div className=" absolute top-0 left-0 w-full h-screen bg-white z-40">
          <div className="flex h-screen justify-center items-center ">
            <div className="md:w-[600px] w-full ml-[100px] md:ml-0">
              {" "}
              <div className=" bg-white p-5 rounded shadow-all">
                <h3 className="font-pop font-bold text-black text-xl">
                  Update your profile picture
                </h3>
                {image ? (
                  <div className="w-[100px] h-[100px] mx-auto my-4 overflow-hidden rounded-full">
                    <div className="img-preview w-full h-full rounded-full " />
                  </div>
                ) : (
                  <div className="w-[80px] h-[80px] mx-auto my-4 overflow-hidden rounded-full">
                    <img src={data.photoURL} />
                  </div>
                )}
                <div className="mb-4">
                  <input
                    className=""
                    type="file"
                    onChange={handleImageUploadChange}
                  />
                </div>
                <div className="w-full">
                  {image && (
                    <Cropper
                      style={{ height: 400, width: "100%" }}
                      zoomTo={0.5}
                      initialAspectRatio={1}
                      preview=".img-preview"
                      src={image}
                      viewMode={1}
                      minCropBoxHeight={10}
                      minCropBoxWidth={10}
                      background={false}
                      responsive={true}
                      autoCropArea={1}
                      checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                      guides={true}
                    />
                  )}
                  <br />
                  {loading ? (
                    <ThreeDots
                      height="100"
                      width="100"
                      radius="9"
                      color=" #5F35F5"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  ) : (
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={handleUpload}
                        className="font-pop font-medium text-white bg-greenLight px-8 py-[4px] rounded-lg"
                      >
                        upload
                      </button>
                      <button
                        onClick={handleCancel}
                        className=" font-pop font-medium text-white bg-red-500 px-8 py-[4px] rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="w-[100px] bg-dark h-screen fixed p-5 flex flex-col justify-between z-50">
        <div className="flex flex-col flex-2 gap-y-14 items-center">
          <div className="w-[50px] h-[50px] relative group cursor-pointer">
            <img
              className="w-full rounded-full"
              src={data && `${data.photoURL}`}
              alt="profile"
            />
            <button
              onClick={handleClickProfile}
              className="hidden group-hover:block w-full h-full bg-black rounded-full opacity-50 absolute top-0 left-0"
            >
              <div className="flex h-full justify-center items-center">
                <AiOutlineCloudUpload className="text-white text-[24px]" />
              </div>
            </button>
          </div>
          <button>
            <BiHomeAlt
              data-tip="Dashboard"
              className=" text-[40px] text-greenLight"
            />
          </button>

          <button>
            <AiOutlineMessage className=" text-[40px] text-white" />
          </button>
          <button>
            <IoMdNotificationsOutline className=" text-[40px] text-white" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-y-5">
          <button>
            <BsSearch className=" text-[40px] text-white" />
          </button>
          <button>
            <AiOutlineSetting className=" text-[40px] text-white" />
          </button>
          <button>
            <AiOutlineLogout
              onClick={handleLogout}
              className=" text-[40px] text-white"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidbar;
