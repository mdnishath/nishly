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
    <div className="w-full shadow-all p-5 rounded h-[45vh] overflow-y-auto scrolbar">
      <h3 className="font-pop text-[20px] md:text-[24px] text-gray-700 font-bold relative">
        Friend Requests
        <BiDotsVerticalRounded className="text-[30px] absolute top-0 right-0" />
      </h3>

      <div className="md:p-3 divide-y divide-slate-200">
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
      </div>
    </div>
  );
};

export default Friendrequest;
