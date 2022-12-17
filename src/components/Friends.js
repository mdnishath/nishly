import React, { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdBlock } from "react-icons/md";
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

const Friends = () => {
  let data = useSelector((state) => state.userData.userInfo);
  const [friends, setFriends] = useState([]);
  const db = getDatabase();
  useEffect(() => {
    onValue(ref(db, "friend"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        if (
          data.uid == item.val().receiverId ||
          data.uid == item.val().senderId
        ) {
          arr.push({ ...item.val(), blockID: item.key });
        }
      });

      setFriends(arr);
    });
  }, []);

  const handleBlock = (item) => {
    set(push(ref(db, "blockList")), {
      ...item,
      blockBy: data.uid,
    }).then(() => {
      remove(ref(db, "friend/" + item.blockID));
    });
  };
  //console.log(friends);
  return (
    <div className="w-full shadow-all p-5 rounded h-[45vh] overflow-y-auto scrolbar">
      <h3 className="font-pop text-[20px] md:text-[24px] text-gray-700 font-bold relative">
        Friends
        <BiDotsVerticalRounded className="text-[30px] absolute top-0 right-0" />
      </h3>

      <div className="md:p-3 divide-y divide-slate-200">
        {friends.map((item) => (
          <div key={item.userID}>
            <div className="flex items-center gap-x-3 py-5 ">
              <div className="w-[50px] h-[50px]">
                <img
                  className="rounded-full w-full"
                  src={
                    data.uid == item.senderId
                      ? item.receiverPhotoURL
                      : item.senderPhotoURL
                  }
                  alt=""
                />
              </div>
              <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
                {data.uid == item.senderId
                  ? item.receiverName
                  : item.senderName}
              </h3>

              <div className="grow">
                <div className="flex w-full justify-end">
                  <button
                    onClick={() => handleBlock(item)}
                    className="font-pop font-medium text-white bg-greenLight px-8 py-[4px] rounded-lg"
                  >
                    Block
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friends;
