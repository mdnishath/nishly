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
    <div className="w-full shadow-all p-5 rounded h-[45vh] overflow-y-auto scrolbar">
      <h3 className="font-pop text-[20px] md:text-[24px] text-gray-700 font-bold relative">
        Block List
        <BiDotsVerticalRounded className="text-[30px] absolute top-0 right-0" />
      </h3>

      <div className="md:p-3 divide-y divide-slate-200">
        {blockList.map((item) => (
          <div key={item.blockID}>
            {data.uid == item.blockBy ? (
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
                      onClick={() => handleUnBlock(item)}
                      className="font-pop font-medium text-white bg-red-500 px-8 py-[4px] rounded-lg"
                    >
                      Unblock
                    </button>
                  </div>
                </div>
              </div>
            ) : (
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
                      // onClick={() => handleUnBlock(item)}
                      className="font-pop font-medium text-white bg-red-500 px-8 py-[4px] rounded-lg"
                    >
                      Request
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* <div className="flex items-center gap-x-3 py-5 ">
          <div className="w-[50px] h-[50px]">
            <img
              className="rounded-full w-full"
              src="images/profile.png"
              alt=""
            />
          </div>
          <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
            React Develpmet
          </h3>

          <div className="grow">
            <div className="flex w-full justify-end">
              <button className="font-pop font-medium text-white bg-greenLight px-8 py-[4px] rounded-lg">
                Join
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Blocklist;
