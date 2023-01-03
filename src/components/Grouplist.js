import React, { useState, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { ThreeDots } from "react-loader-spinner";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  getDatabase,
  onValue,
  set,
  push,
  update,
  ref as dbRef,
} from "firebase/database";
import { getAuth, updateProfile, signOut } from "firebase/auth";
import {
  getStorage,
  uploadString,
  getDownloadURL,
  ref,
} from "firebase/storage";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { userData } from "../slices/userSlice";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const Grouplist = () => {
  const auth = getAuth();
  const storage = getStorage();
  const db = getDatabase();
  let data = useSelector((state) => state.userData.userInfo);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [gname, setGName] = useState("");
  const [groupTag, setGroupTag] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [groupTagError, setGroupTagError] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [groupGoinList, setGroupGoinList] = useState([]);
  const [image, setImage] = useState("images/profile.png");
  const [gimage, setGImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [blockList, setBlockList] = useState([]);

  useEffect(() => {
    onValue(dbRef(db, "blockList"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receiverId);
      });

      setBlockList(arr);
    });
  }, []);

  // console.log(blockList);

  //Create Group
  const handleCreateGroup = () => {
    setShow(!show);
  };
  //Check group name input  and set

  const handleChangeGName = (e) => {
    setGName(e.target.value);
    setGroupNameError("");
  };
  const handleChangeTag = (e) => {
    setGroupTag(e.target.value);
    setGroupTagError("");
  };
  useEffect(() => {
    onValue(dbRef(db, "group"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        console.log();
        arr.push({ ...item.val(), groupID: item.key });
      });

      const newArray = arr.filter((item) => !item.adminid.includes(blockList));

      setGroupList(arr);
    });
  }, []);

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
      const storageRef = ref(storage, auth.currentUser.uid + Date.now());
      const message4 = cropper.getCroppedCanvas().toDataURL();
      setLoading(true);
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        // console.log("Uploaded a data_url string!");
        getDownloadURL(storageRef)
          .then((downloadURL) => {
            setGImage(downloadURL);
            set(push(dbRef(db, "group")), {
              groupname: gname,
              grouptags: groupTag,
              adminid: data.uid,
              adminemail: data.email,
              adminname: data.displayName,
              groupimage: downloadURL,
            }).then(() => {
              setGName("");
              setGroupTag("");
              setLoading(false);
              setShow(false);
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

  const handleCreate = () => {
    if (!gname) {
      setGroupNameError("Can not be empty");
    }
    if (!groupTag) {
      setGroupTagError("Can not be empty");
    }
    if (gname && groupTag) {
      setLoading(true);
      getCropData();
    }
  };

  const handleGroupJoinRequest = (item) => {
    console.log(item);
    set(push(dbRef(db, "groupJoinRequestList")), {
      groupName: item.groupname,
      groupID: item.groupID,
      groupAdminID: item.adminid,
      groupAdminName: item.adminname,
      groupAdminEmail: item.adminemail,
      groupImage: item.groupimage,
      senderName: data.displayName,
      senderID: data.uid,
      senderEmail: data.email,
      senderImage: data.photoURL,
    });
  };
  useEffect(() => {
    onValue(dbRef(db, "groupJoinRequestList"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        // arr.push({ ...item.val(), joinID: item.key });
        // console.log(item.val());
        arr.push(item.val().groupAdminID + item.val().senderID);
      });

      setGroupGoinList(arr);
    });
  }, []);

  return (
    <div className="w-full shadow-all p-5 rounded h-[45vh] overflow-y-auto scrolbar">
      <h3 className="font-pop text-[20px] md:text-[24px] text-gray-700 font-bold relative">
        Group List
        {show ? (
          <AiOutlineClose
            onClick={() => setShow(!show)}
            className="text-[30px] font-bold absolute top-0 right-0 font-pop text-red-500 cursor-pointer"
          />
        ) : (
          <button
            onClick={handleCreateGroup}
            className="text-lg font-bold absolute top-0 right-0 font-pop text-greenLight"
          >
            Creacte Group
          </button>
        )}
      </h3>
      {show ? (
        <div className="w-full py-4">
          <div>
            <div className="flex items-center space-x-4">
              {image ? (
                <div className="w-[50px] h-[50px] my-4 overflow-hidden rounded-full">
                  <div className="img-preview w-full h-full rounded-full " />
                </div>
              ) : (
                <div className="w-[50px] h-[50px] my-4 overflow-hidden rounded-full">
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
            </div>

            <div className="w-full">
              {image && (
                <Cropper
                  style={{ height: 200, width: "100%" }}
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
              ) : null}
            </div>
          </div>
          <div className="mb-4">
            <input
              className="w-full border px-5 py-2"
              type="text"
              placeholder="Group Name"
              onChange={(e) => handleChangeGName(e)}
              value={gname}
            />
            <p className=" text-red-500">{groupNameError && groupNameError}</p>
          </div>
          <div className="mb-4">
            <input
              className="w-full border px-5 py-2"
              type="text"
              placeholder="Group Tags"
              onChange={(e) => handleChangeTag(e)}
              value={groupTag}
            />
            <p className=" text-red-500">{groupTagError && groupTagError}</p>
          </div>
          <div onClick={handleCreate} className="flex justify-end">
            {loading ? (
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#4fa94d"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            ) : (
              <button className="font-pop font-medium text-white bg-greenLight px-8 py-[4px] rounded-lg">
                Create
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="md:p-3 divide-y divide-slate-200">
          {groupList.map((item) => (
            <div key={item.groupID}>
              <div className="flex items-center gap-x-3 py-5 ">
                <div className="w-[50px] h-[50px]">
                  <img
                    className="rounded-full w-full h-full"
                    src={item.groupimage}
                    alt=""
                  />
                </div>
                <div>
                  <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
                    {item.groupname}
                  </h3>
                  <h3 className="font-pop text-sm md:text-sm  text-gray-500 font-semibold">
                    {item.adminname}
                  </h3>
                  <h3 className="font-pop text-sm md:text-sm  text-gray-500 font-semibold">
                    {item.adminemail}
                  </h3>

                  <p>{item.grouptags}</p>
                </div>

                <div className="grow">
                  <div className="flex w-full justify-end">
                    {item.adminid === data.uid ? (
                      <button className="font-pop font-medium text-white bg-green-500 px-8 py-[4px] rounded-lg">
                        Joined
                      </button>
                    ) : groupGoinList.includes(item.adminid + data.uid) ? (
                      <button className="font-pop font-medium text-white bg-red-500 px-8 py-[4px] rounded-lg">
                        Requested
                      </button>
                    ) : (
                      <button
                        onClick={() => handleGroupJoinRequest(item)}
                        className="font-pop font-medium text-white bg-blue-500 px-8 py-[4px] rounded-lg"
                      >
                        Join
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Grouplist;
// {data.uid === item.adminid ? (
//   <button className="font-pop font-medium text-white bg-blue-500 px-8 py-[4px] rounded-lg">
//     Joined
//   </button>
// ) : groupGoinList.includes(item.adminid + data.uid) ||
//   groupGoinList.includes(data.uid + item.adminid) ? (
//   <button className="font-pop font-medium text-white bg-red-500 px-8 py-[4px] rounded-lg">
//     Requested
//   </button>
// ) : (
//   <button
//     onClick={() => handleGroupJoinRequest(item)}
//     className="font-pop font-medium text-white bg-greenLight px-8 py-[4px] rounded-lg"
//   >
//     Join
//   </button>
// )}
