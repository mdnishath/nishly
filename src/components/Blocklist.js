import React, { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
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

const Blocklist = () => {
  let data = useSelector((state) => state.userData.userInfo);
  const [blockList, setBlockList] = useState([]);
  const db = getDatabase();
  useEffect(() => {
    onValue(ref(db, "blockList"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), blockID: item.key });
      });

      setBlockList(arr);
    });
  }, []);

  const handleUnBlock = (item) => {
    set(push(ref(db, "friend")), {
      ...item,
    }).then(() => {
      remove(ref(db, "blockList/" + item.blockID));
    });
  };
  //console.log(blockList);
  return (
    <div className="h-[360px] w-full overflow-x-hidden rounded-xl bg-white p-5 shadow-all">
      <div className="flex justify-between gap-x-2">
        <h3 className=" text-2xl font-semibold text-primary">Block List</h3>
        {blockList.length > 0 && <Search obj={blockList} />}
      </div>

      <div className="mt-5">
        <div className="divide-y">
          {blockList.length > 0
            ? blockList.map((item) => (
                <div key={item.blockID}>
                  {data.uid === item.blockBy && (
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
                          onClick={() => handleUnBlock(item)}
                          className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn"
                        >
                          Unblock
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            : "No blocked user"}
        </div>
      </div>
    </div>
  );
};

export default Blocklist;
