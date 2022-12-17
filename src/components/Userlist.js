import React, { useEffect, useState } from "react";
import { BiDotsVerticalRounded, BiMinus } from "react-icons/bi";

import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";
import { MdBlock } from "react-icons/md";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { userData } from "../slices/userSlice";
import { getAuth, signOut } from "firebase/auth";

const Userlist = () => {
  const auth = getAuth();
  const db = getDatabase();
  let data = useSelector((state) => state.userData.userInfo);
  const dispatch = useDispatch();

  const [userList, setUserList] = useState([]);
  const [friendrequestList, setFriendrequestList] = useState([]);

  const [friends, setFriends] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const [show, setShow] = useState(true);
  useEffect(() => {
    const userRef = ref(db, "users");

    onValue(userRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        if (data.uid != item.key) {
          arr.push(item.val());
        }
      });

      setUserList(arr);
    });
  }, []);
  useEffect(() => {
    const userRef = ref(db, "friendRQ");
    onValue(userRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receiverId + item.val().senderId);
      });

      setFriendrequestList(arr);
    });
  }, []);

  const handleFriendRequest = (item) => {
    set(ref(db, "friendRQ/" + data.uid + item.uid), {
      senderId: data.uid,
      senderName: data.displayName,
      senderPhotoURL: data.photoURL,
      receiverId: item.uid,
      receiverName: item.username,
      receiverPhotoURL: item.photoURL,
      userID: data.uid + item.uid,
    });
  };
  useEffect(() => {
    onValue(ref(db, "friend"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receiverId + item.val().senderId);
      });

      setFriends(arr);
    });
  }, []);

  useEffect(() => {
    onValue(ref(db, "blockList"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().senderId + item.val().receiverId);
      });

      setBlockList(arr);
    });
  }, []);

  const handleCancelFriendRequest = (item) => {
    // //console.log(item);
  };

  return (
    <div className="w-full shadow-all p-5 rounded h-[45vh] overflow-y-auto scrolbar">
      <h3 className="font-pop text-[20px] md:text-[24px] text-gray-700 font-bold relative">
        User List
        <BiDotsVerticalRounded className="text-[30px] absolute top-0 right-0" />
      </h3>

      <div className="md:p-3 divide-y divide-slate-200">
        <>
          {userList.map((item) => (
            <div key={item.uid} className="flex items-center gap-x-3 py-5 ">
              <div className="w-[50px] h-[50px]">
                <img className="rounded-full w-full" src={item.photoURL} />
              </div>
              <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
                {item.username}
              </h3>

              <div className="grow">
                <div className="flex w-full justify-end">
                  {blockList.includes(item.uid + data.uid) ||
                  blockList.includes(data.uid + item.uid) ? (
                    <button className="font-pop font-medium text-white bg-red-500 px-[4px] py-[4px] rounded">
                      <MdBlock />
                    </button>
                  ) : friends.includes(item.uid + data.uid) ||
                    friends.includes(data.uid + item.uid) ? (
                    <button className="font-pop font-medium text-white bg-blue-500 px-[4px] py-[4px] rounded">
                      <AiOutlineCheck />
                    </button>
                  ) : friendrequestList.includes(item.uid + data.uid) ||
                    friendrequestList.includes(data.uid + item.uid) ? (
                    <button
                      onClick={() => handleCancelFriendRequest(item)}
                      className="font-pop font-medium text-white bg-red-500 px-[4px] py-[4px] rounded"
                    >
                      <BiMinus />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFriendRequest(item)}
                      className="font-pop font-medium text-white bg-greenLight px-[4px] py-[4px] rounded"
                    >
                      <AiOutlinePlus />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      </div>
    </div>
  );
};

export default Userlist;
