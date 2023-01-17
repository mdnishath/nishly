import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";

import { useSelector } from "react-redux";
import GroupSearch from "../components/GroupSearch";

const MessageGroups = () => {
  const db = getDatabase();
  const [messageGroups, setMessageGroups] = useState([]);
  let src = useSelector((state) => state.filterData.data);
  useEffect(() => {
    onValue(ref(db, "group"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), groupID: item.key });
      });

      setMessageGroups(arr);
    });
  }, []);

  return (
    <div className="h-[360px] w-full overflow-x-hidden rounded-xl bg-white p-5 shadow-all">
      <div className="flex justify-between gap-x-2">
        <h3 className=" text-2xl font-semibold text-primary">Group List</h3>
        {messageGroups.length > 0 && <GroupSearch obg={messageGroups} />}
      </div>
      <div className="mt-5">
        <div className="divide-y">
          {messageGroups.map((item) => (
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
                <button className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn">
                  msg
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    // <div className="w-full shadow-all p-5 rounded h-[45vh] overflow-y-auto scrolbar">
    //   <div className="flex justify-between gap-x-2 items-center">
    //     <h3 className="font-pop text-[20px] md:text-[24px] text-gray-700 font-bold relative inline-block">
    //       User List
    //     </h3>
    //     <GroupSearch obj={messageGroups} />
    //   </div>
    //   {src.length > 0 ? (
    //     src.map((item, index) => (
    //       <div key={item.index} className="flex items-center gap-x-3 py-5 ">
    //         <div className="w-[50px] h-[50px]">
    //           <img
    //             className="rounded-full w-full"
    //             src={item.groupimage}
    //             loading="lazy"
    //           />
    //         </div>
    //         <div>
    //           <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
    //             {item.groupname}
    //           </h3>
    //           {/* <h3 className="font-pop text-sm md:text-sm  text-gray-500 font-semibold">
    //             {item.adminname}
    //           </h3> */}
    //           {/* <h3 className="font-pop text-sm md:text-sm  text-gray-500 font-semibold">
    //                 {item.adminemail}
    //               </h3> */}

    //           <p className=" bg-slate-200 inline-block text-sm px-3 rounded py-1">
    //             {item.grouptags}
    //           </p>
    //         </div>
    //         <div className="grow">
    //           <div className="flex w-full justify-end">
    //             <button
    //               //   onClick={() => handleGroupJoinRequest(item)}
    //               className="font-pop font-medium text-white bg-blue-500 px-8 py-[4px] rounded-lg"
    //             >
    //               Join
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     ))
    //   ) : (
    //     <div className="md:p-3 divide-y divide-slate-200">
    //       {messageGroups.map((item) => (
    //         <div key={item.groupID}>
    //           <div className="flex items-center gap-x-3 py-5 ">
    //             <div className="w-[50px] h-[50px]">
    //               <img
    //                 className="rounded-full  w-full h-full"
    //                 src={item.groupimage}
    //                 alt=""
    //               />
    //             </div>
    //             <div>
    //               <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
    //                 {item.groupname}
    //               </h3>
    //               {/* <h3 className="font-pop text-sm md:text-sm  text-gray-500 font-semibold">
    //             {item.adminname}
    //           </h3> */}
    //               {/* <h3 className="font-pop text-sm md:text-sm  text-gray-500 font-semibold">
    //                 {item.adminemail}
    //               </h3> */}

    //               <p className=" bg-slate-200 inline-block text-sm px-3 rounded py-1">
    //                 {item.grouptags}
    //               </p>
    //             </div>
    //             <div className="grow">
    //               <div className="flex w-full justify-end">
    //                 <button
    //                   //   onClick={() => handleGroupJoinRequest(item)}
    //                   className="font-pop font-medium text-white bg-blue-500 px-8 py-[4px] rounded-lg"
    //                 >
    //                   Join
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   )}
    // </div>
  );
};
export default MessageGroups;
