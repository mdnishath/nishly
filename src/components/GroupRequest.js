import React from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { useSelector } from "react-redux";

const GroupRequest = ({
  groupJoinList,
  addGroupMembers,
  deletGroupRequest,
}) => {
  let data = useSelector((state) => state.userData.userInfo);
  return (
    <div className="mt-5">
      <div className="divide-y">
        {groupJoinList.length > 0
          ? groupJoinList.map((jn, index) => (
              <div
                key={jn.index}
                className="flex items-center justify-between py-4"
              >
                <div className="h-[40px] w-[40px] rounded-full shadow-lg">
                  <img
                    className="w-full rounded-full"
                    src={jn.senderImage}
                    alt="profile"
                  />
                </div>

                <div className="pl-5">
                  <h4 className="text-base font-semibold">{jn.senderName}</h4>
                  {/* <span className="inline-block rounded-full bg-slate-100 px-3 text-[12px] text-greenLight">
                    {item.grouptags}
                  </span> */}
                </div>
                <div className="flex grow justify-end gap-x-2">
                  <button
                    onClick={() => addGroupMembers(jn)}
                    className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn"
                  >
                    Accpet
                  </button>
                  <button
                    onClick={() => deletGroupRequest(jn)}
                    className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          : '"No request found"'}
      </div>
    </div>

    // <div className="md:p-3 divide-y divide-slate-200">
    //   {groupJoinList.length > 0
    //     ? groupJoinList.map((jn, index) => (
    //         <div key={jn.index}>
    //           <div className="flex items-center gap-x-3 py-5 ">
    //             <div className="w-[50px] h-[50px]">
    //               <img
    //                 className="rounded-full  w-full h-full"
    //                 src={jn.senderImage}
    //                 alt=""
    //               />
    //             </div>
    //             <div>
    //               <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
    //                 {jn.senderName}
    //               </h3>

    //               {/* <p></p> */}
    //             </div>

    //             <div className="grow">
    //               <div className="flex w-full justify-end gap-x-3">
    //                 <div className="flex gap-x-2">
    //                   <AiOutlineCheck
    //                     onClick={() => addGroupMembers(jn)}
    //                     className="text-[24px] cursor-pointer text-greenLight"
    //                   />

    //                   <BsTrash
    //                     onClick={() => deletGroupRequest(jn)}
    //                     className="text-[24px] cursor-pointer text-red-500"
    //                   />
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       ))
    //     : "No request found"}
    // </div>
  );
};

export default GroupRequest;
