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
  remove,
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
  const [groupadded, setGroupadded] = useState([]);

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
        // console.log(item.val());
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
    // console.log(item.groupID + data.uid);
    set(dbRef(db, "groupJoinRequestList/" + item.groupID + data.uid), {
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
      requestID: item.groupID + item.adminid,
    });
  };
  useEffect(() => {
    onValue(dbRef(db, "groupJoinRequestList"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        // arr.push(item.val());
        // console.log(item.val());
        arr.push(item.val().groupID + item.val().senderID);
      });

      setGroupGoinList(arr);
    });
  }, []);
  useEffect(() => {
    onValue(dbRef(db, "groupJoinRequestList"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        // arr.push(item.val());
        // console.log(item.val());
        arr.push(item.val().groupID + item.val().senderID);
      });

      setGroupGoinList(arr);
    });
  }, []);
  useEffect(() => {
    onValue(dbRef(db, "groupmembers"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        // arr.push(item.val());
        // console.log(item.val());
        arr.push(item.val().groupID + item.val().memberID);
      });

      setGroupadded(arr);
    });
  }, []);

  const deletGroupRequest = (item, uid) => {
    // console.log(item.groupID + uid);
    remove(dbRef(db, "groupJoinRequestList/" + item.groupID + uid));
  };

  // console.log(groupadded);

  return (
    <div className="h-[360px] w-full overflow-x-hidden rounded-xl bg-white p-5 shadow-all">
      <div className="flex justify-between">
        <h3 className=" text-2xl font-semibold text-primary">Group List</h3>
        <div>
          {show ? (
            <AiOutlineClose
              onClick={() => setShow(!show)}
              className="text-[30px] font-bold font-pop text-red-500 cursor-pointer"
            />
          ) : (
            <button
              onClick={handleCreateGroup}
              className="text-base font-semibold font-pop text-greenLight"
            >
              Create Group
            </button>
          )}
        </div>
      </div>

      {show ? (
        <div className="w-full py-4">
          <div>
            <div className="flex items-center space-x-4">
              {image ? (
                <div className="h-[40px] w-[40px] rounded-full shadow-lg my-4 overflow-hidden">
                  <div className="img-preview w-full h-full rounded-full " />
                </div>
              ) : (
                <div className="h-[40px] w-[40px] rounded-full shadow-lg my-4 overflow-hidden">
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
        <div className="mt-5">
          <div className="divide-y">
            {groupList.map((item) => (
              <div className="flex items-center justify-between py-4">
                <div className="h-[40px] w-[40px] rounded-full shadow-lg">
                  <img
                    className="w-full rounded-full"
                    src={item.groupimage}
                    alt="profile"
                  />
                </div>

                <div className="pl-5">
                  <h4 className="text-base font-semibold">{item.groupname}</h4>
                  <span className="inline-block rounded-full bg-slate-100 px-3 text-[12px] text-greenLight">
                    {item.grouptags}
                  </span>
                </div>
                <div className="flex grow justify-end">
                  {item.adminid === data.uid ? (
                    <button className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn">
                      Own
                    </button>
                  ) : groupadded.includes(item.groupID + data.uid) ? (
                    <button className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn">
                      Joined
                    </button>
                  ) : groupGoinList.includes(item.groupID + data.uid) ? (
                    <button
                      onClick={() => deletGroupRequest(item, data.uid)}
                      className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleGroupJoinRequest(item)}
                      className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Grouplist;
