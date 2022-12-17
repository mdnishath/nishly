import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userData, uploadingData, cropedData } from "../slices/userSlice";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getStorage,
  uploadString,
  getDownloadURL,
  ref as imageRef,
} from "firebase/storage";
import { getDatabase, ref, update } from "firebase/database";
import { getAuth, updateProfile } from "firebase/auth";
import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";

const UplodingImage = ({ where, isProfile }) => {
  const auth = getAuth();
  const storage = getStorage();
  const db = getDatabase();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let data = useSelector((state) => state.userData.userInfo);
  let cropedImage = useSelector((state) => state.userData.cropimage);
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState();
  const [cropper, setCropper] = useState();
  const [loading, setLoading] = useState(false);
  console.log(isProfile);
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
      const storageRef = imageRef(storage, auth.currentUser.uid);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      //   setLoading(true);
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        if (!isProfile) {
          getDownloadURL(storageRef)
            .then((downloadURL) => {
              setImage(downloadURL);
              dispatch(cropedData(downloadURL));
              //   setLoading(false);
            })
            .catch((error) => {
              console.log(error);
            });
        }

        // else {
        //   getDownloadURL(storageRef)
        //     .then((downloadURL) => {
        //       const postData = {
        //         photoURL: downloadURL,
        //       };
        //       update(ref(db, `${where}/` + data.uid), postData);
        //       updateProfile(auth.currentUser, {
        //         photoURL: downloadURL,
        //       }).then(() => {
        //         dispatch(uploadingData(false));
        //         setImage("");
        //         setCropData("");
        //         setCropper("");
        //         setLoading(false);
        //       });
        //     })
        //     .catch((error) => {
        //       console.log(error);
        //     });
        // }
      });
    }
  };

  const handleCancel = () => {
    dispatch(uploadingData(false));
    setImage("");
    setCropData("");
    setCropper("");
  };
  const handleUpload = () => {
    getCropData();
  };
  return (
    <div
      className={`${isProfile ? "w-[600px] ml-[100px]" : "w-full md:ml-0"}  `}
    >
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
          <input className="" type="file" onChange={handleImageUploadChange} />
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
              <>
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
              </>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UplodingImage;
