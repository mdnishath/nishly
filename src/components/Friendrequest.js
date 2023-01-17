import React, { useState, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlinePlus, AiOutlineUserAdd } from "react-icons/ai";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { userData } from "../slices/userSlice";
import Search from "./Search";

const Friendrequest = () => {
  let data = useSelector((state) => state.userData.userInfo);
  const dispatch = useDispatch();
  const db = getDatabase();
  const [friendrequestList, setFriendrequestList] = useState([]);
  const [show, setShow] = useState(true);
  useEffect(() => {
    const userRef = ref(db, "friendRQ");
    onValue(userRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        // //console.log(userInfo.uid + item.val().senderId);
        // //console.log(item.val().senderId + userInfo.uid);
        if (item.val().receiverId == data.uid) {
          arr.push({ ...item.val(), userID: item.key });
        }
      });

      setFriendrequestList(arr);
    });
  }, []);
  const handleAddFrindRequest = (item) => {
    //console.log(item);
    set(push(ref(db, "friend")), {
      ...item,
    }).then(() => {
      remove(ref(db, "friendRQ/" + item.userID));
    });
  };

  return (
    <div className="h-[360px] w-full overflow-x-hidden rounded-xl bg-white p-5 shadow-all">
      <div className="flex justify-between gap-x-2">
        <h3 className=" text-2xl font-semibold text-primary">Friend Request</h3>
        {friendrequestList.length > 0 && <Search obj={friendrequestList} />}
      </div>
      <div className="mt-5">
        <div className="divide-y">
          {friendrequestList.map((item) => (
            <div
              key={item.userID}
              className="flex items-center justify-between py-4"
            >
              <div className="h-[40px] w-[40px] rounded-full shadow-lg">
                <img
                  className="w-full rounded-full"
                  src={item.senderPhotoURL}
                  alt="profile"
                />
              </div>

              <div className="pl-5">
                <h4 className="text-base font-semibold">{item.senderName}</h4>
                {/* <span className="inline-block rounded-full bg-slate-100 px-3 text-[12px] text-greenLight">
                  {item.grouptags}
                </span> */}
              </div>
              <div className="flex grow justify-end">
                <button
                  onClick={() => handleAddFrindRequest(item)}
                  className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn"
                >
                  Block
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="md:p-3 divide-y divide-slate-200">
        <>
          {friendrequestList.map((item) => (
            <div key={item.userID} className="flex items-center gap-x-3 py-5 ">
              <div className="w-[50px] h-[50px]">
                <img
                  className="rounded-full w-full"
                  src={item.senderPhotoURL}
                />
              </div>
              <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
                {item.senderName}
              </h3>

              <div className="grow">
                <div className="flex w-full justify-end">
                  <button
                    onClick={() => handleAddFrindRequest(item)}
                    className="font-pop font-medium text-white bg-greenLight px-[4px] py-[4px] rounded"
                  >
                    <AiOutlineUserAdd />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      </div> */}
    </div>
  );
};

export default Friendrequest;
