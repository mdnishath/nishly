import React, { useEffect, useState } from "react";
import { BiDotsVerticalRounded, BiMinus } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";

import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";
import { MdBlock } from "react-icons/md";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { userData } from "../slices/userSlice";
import { getAuth, signOut } from "firebase/auth";
import Search from "./Search";
// import { useSelector } from "react-redux";

const Userlist = () => {
  const auth = getAuth();
  const db = getDatabase();
  let data = useSelector((state) => state.userData.userInfo);
  let src = useSelector((state) => state.filterData.data);
  console.log(src);
  const dispatch = useDispatch();

  const [userList, setUserList] = useState([]);
  const [friendrequestList, setFriendrequestList] = useState([]);
  // const [showform, setShowForm] = useState(false);

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
    <div className="h-[360px] w-full overflow-x-hidden rounded-xl bg-white p-5 shadow-all">
      <div className="flex justify-between gap-x-2">
        <h3 className=" text-2xl font-semibold text-primary">User List</h3>
        {userList.length > 0 && <Search obj={userList} />}
      </div>

      <div className="divide-y">
        {src.length > 0
          ? src.map((item) => (
              <div
                key={item.uid}
                className="flex items-center justify-between py-4"
              >
                <div className="h-[40px] w-[40px] rounded-full shadow-lg">
                  <img
                    className="w-full rounded-full"
                    src={item.photoURL}
                    alt="profile"
                  />
                </div>

                <div className="pl-5">
                  <h4 className="text-base font-semibold">{item.username}</h4>
                  {/* <span className="inline-block rounded-full bg-slate-100 px-3 text-[12px] text-greenLight">
                  {item.grouptags}
                </span> */}
                </div>
                <div className="flex grow justify-end">
                  {blockList.includes(item.uid + data.uid) ||
                  blockList.includes(data.uid + item.uid) ? (
                    <button className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn">
                      Blocked
                    </button>
                  ) : friends.includes(item.uid + data.uid) ||
                    friends.includes(data.uid + item.uid) ? (
                    <button className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn">
                      Friend
                    </button>
                  ) : friendrequestList.includes(item.uid + data.uid) ||
                    friendrequestList.includes(data.uid + item.uid) ? (
                    <button
                      onClick={() => handleCancelFriendRequest(item)}
                      className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFriendRequest(item)}
                      className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn"
                    >
                      Add Friend
                    </button>
                  )}
                </div>
              </div>
            ))
          : userList.map((item) => (
              <div
                key={item.uid}
                className="flex items-center justify-between py-4"
              >
                <div className="h-[40px] w-[40px] rounded-full shadow-lg">
                  <img
                    className="w-full rounded-full"
                    src={item.photoURL}
                    alt="profile"
                  />
                </div>

                <div className="pl-5">
                  <h4 className="text-base font-semibold">{item.username}</h4>
                  {/* <span className="inline-block rounded-full bg-slate-100 px-3 text-[12px] text-greenLight">
                  {item.grouptags}
                </span> */}
                </div>
                <div className="flex grow justify-end">
                  {blockList.includes(item.uid + data.uid) ||
                  blockList.includes(data.uid + item.uid) ? (
                    <button className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn">
                      Blocked
                    </button>
                  ) : friends.includes(item.uid + data.uid) ||
                    friends.includes(data.uid + item.uid) ? (
                    <button className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn">
                      Friend
                    </button>
                  ) : friendrequestList.includes(item.uid + data.uid) ||
                    friendrequestList.includes(data.uid + item.uid) ? (
                    <button
                      onClick={() => handleCancelFriendRequest(item)}
                      className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFriendRequest(item)}
                      className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn"
                    >
                      Add Friend
                    </button>
                  )}
                </div>
              </div>
              // <div key={item.uid} className="flex items-center gap-x-3 py-5 ">
              //   <div className="w-[50px] h-[50px]">
              //     <img
              //       className="rounded-full w-full"
              //       src={item.photoURL}
              //       loading="lazy"
              //     />
              //   </div>
              //   <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
              //     {item.username}
              //   </h3>

              //   <div className="grow">
              //     <div className="flex w-full justify-end">
              //       {blockList.includes(item.uid + data.uid) ||
              //       blockList.includes(data.uid + item.uid) ? (
              //         <button className="font-pop font-medium text-white bg-red-500 px-[4px] py-[4px] rounded">
              //           <MdBlock />
              //         </button>
              //       ) : friends.includes(item.uid + data.uid) ||
              //         friends.includes(data.uid + item.uid) ? (
              //         <button className="font-pop font-medium text-white bg-blue-500 px-[4px] py-[4px] rounded">
              //           <AiOutlineCheck />
              //         </button>
              //       ) : friendrequestList.includes(item.uid + data.uid) ||
              //         friendrequestList.includes(data.uid + item.uid) ? (
              //         <button
              //           onClick={() => handleCancelFriendRequest(item)}
              //           className="font-pop font-medium text-white bg-red-500 px-[4px] py-[4px] rounded"
              //         >
              //           <BiMinus />
              //         </button>
              //       ) : (
              //         <button
              //           onClick={() => handleFriendRequest(item)}
              //           className="font-pop font-medium text-white bg-greenLight px-[4px] py-[4px] rounded"
              //         >
              //           <AiOutlinePlus />
              //         </button>
              //       )}
              //     </div>
              //   </div>
              // </div>
            ))}
      </div>
    </div>
  );
};

export default Userlist;

// userList.map((item) => (
//   <div key={item.uid} className="flex items-center gap-x-3 py-5 ">
//     <div className="w-[50px] h-[50px]">
//       <img
//         className="rounded-full w-full"
//         src={item.photoURL}
//         loading="lazy"
//       />
//     </div>
//     <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
//       {item.username}
//     </h3>

//     <div className="grow">
//       <div className="flex w-full justify-end">
//         {blockList.includes(item.uid + data.uid) ||
//         blockList.includes(data.uid + item.uid) ? (
//           <button className="font-pop font-medium text-white bg-red-500 px-[4px] py-[4px] rounded">
//             <MdBlock />
//           </button>
//         ) : friends.includes(item.uid + data.uid) ||
//           friends.includes(data.uid + item.uid) ? (
//           <button className="font-pop font-medium text-white bg-blue-500 px-[4px] py-[4px] rounded">
//             <AiOutlineCheck />
//           </button>
//         ) : friendrequestList.includes(item.uid + data.uid) ||
//           friendrequestList.includes(data.uid + item.uid) ? (
//           <button
//             onClick={() => handleCancelFriendRequest(item)}
//             className="font-pop font-medium text-white bg-red-500 px-[4px] py-[4px] rounded"
//           >
//             <BiMinus />
//           </button>
//         ) : (
//           <button
//             onClick={() => handleFriendRequest(item)}
//             className="font-pop font-medium text-white bg-greenLight px-[4px] py-[4px] rounded"
//           >
//             <AiOutlinePlus />
//           </button>
//         )}
//       </div>
//     </div>
//   </div>
// ))
