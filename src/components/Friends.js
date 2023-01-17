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
import Search from "./Search";

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
    <div className="h-[360px] w-full overflow-x-hidden rounded-xl bg-white p-5 shadow-all">
      <div className="flex justify-between gap-x-2">
        <h3 className=" text-2xl font-semibold text-primary">Friends</h3>
        {friends.length > 0 && <Search obj={friends} />}
      </div>

      <div className="mt-5">
        <div className="divide-y">
          {friends.map((item) => (
            <div className="flex items-center justify-between py-4">
              <div className="h-[40px] w-[40px] rounded-full shadow-lg">
                <img
                  className="w-full rounded-full"
                  src={
                    data.uid == item.senderId
                      ? item.receiverPhotoURL
                      : item.senderPhotoURL
                  }
                  alt="profile"
                />
              </div>

              <div className="pl-5">
                <h4 className="text-base font-semibold">
                  {data.uid == item.senderId
                    ? item.receiverName
                    : item.senderName}
                </h4>
                {/* <span className="inline-block rounded-full bg-slate-100 px-3 text-[12px] text-greenLight">
                  {item.grouptags}
                </span> */}
              </div>
              <div className="flex grow justify-end">
                <button
                  onClick={() => handleBlock(item)}
                  className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn"
                >
                  Block
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Friends;
