import React, { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import {
  AiOutlineInfoCircle,
  AiOutlineClose,
  AiOutlineCheck,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { ThreeDots } from "react-loader-spinner";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
import Groupjoined from "./Groupjoined";
import GroupRequest from "./GroupRequest";

const Mygroups = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userData.userInfo);
  const [loading, setLoading] = useState(false);
  const [myGroups, setmyGroups] = useState([]);
  const [show, setShow] = useState(false);
  const [groupJoinList, setGroupGoinList] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    onValue(ref(db, "group"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        // console.log(item.val());
        if (data.uid == item.val().adminid) {
          arr.push({ ...item.val(), groupID: item.key });
        }
      });

      setmyGroups(arr);
    });
  }, []);

  const handleDeletGroup = (item) => {
    remove(ref(db, "group/" + item.groupID)).then(() => {});
  };

  const getGroupRequest = (item) => {
    // console.log(item);
    setShow(true);

    onValue(ref(db, "groupJoinRequestList"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item2) => {
        if (
          data.uid === item2.val().groupAdminID &&
          item.groupID === item2.val().groupID
        ) {
          arr.push({ ...item2.val(), joinID: item2.key });
        }
      });

      setGroupGoinList(arr);
    });
  };

  const addGroupMembers = (item) => {
    console.log(item);
    set(push(ref(db, "groupmembers")), {
      groupName: item.groupName,
      groupAdminID: item.groupAdminID,
      groupID: item.groupID,
      groupAdminName: item.groupAdminName,
      groupAdminEmail: item.groupAdminEmail,
      groupImage: item.groupImage,
      memberName: item.senderName,
      memberID: item.senderID,
      memberEmail: item.senderEmail,
      memberImage: item.senderImage,
    }).then(() => {
      remove(ref(db, "groupJoinRequestList/" + item.joinID));
    });
  };

  const deletGroupRequest = (item) => {
    remove(ref(db, "groupJoinRequestList/" + item.joinID));
  };

  const showGroupMembers = (item) => {
    setShowMembers(true);

    onValue(ref(db, "groupmembers"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item2) => {
        // console.log(item.val());
        if (
          data.uid === item2.val().groupAdminID &&
          item.groupID === item2.val().groupID
        ) {
          arr.push({ ...item2.val(), key: item2.key });
        }
      });

      setGroupMembers(arr);
    });
  };

  const deletFromGroup = (item) => {
    remove(ref(db, "groupmembers/" + item.key));
  };
  console.log(myGroups);
  return (
    <div className="h-[360px] w-full overflow-x-hidden rounded-xl bg-white p-5 shadow-all">
      <div className="flex justify-between gap-x-2">
        <h3 className=" text-2xl font-semibold text-primary"> My Group</h3>
        {showMembers ? (
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="text-lg font-bold  font-pop text-greenLight"
          >
            Go Back
          </button>
        ) : show ? (
          <button
            onClick={() => setShow(!show)}
            className="text-lg font-bold font-pop text-greenLight"
          >
            Go Back
          </button>
        ) : (
          <button className="text-lg font-bold font-pop text-greenLight">
            Group Info
          </button>
        )}
      </div>
      {showMembers ? (
        groupMembers.length > 0 ? (
          <Groupjoined
            groupMembers={groupMembers}
            deletFromGroup={deletFromGroup}
          />
        ) : (
          "Not Found"
        )
      ) : show ? (
        <GroupRequest
          groupJoinList={groupJoinList}
          deletGroupRequest={deletGroupRequest}
        />
      ) : (
        <div className="mt-5">
          <div className="divide-y">
            {myGroups.map((item) => (
              <div
                key={item.groupID}
                className="flex items-center justify-between py-4"
              >
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
                <div className="flex grow justify-end gap-x-2 items-center">
                  <AiOutlineInfoCircle
                    onClick={() => showGroupMembers(item)}
                    className="text-[24px] cursor-pointer text-primary"
                  />
                  <AiOutlineUsergroupAdd
                    onClick={() => getGroupRequest(item)}
                    className="text-[24px] cursor-pointer text-primary"
                  />
                  <AiOutlineClose
                    onClick={() => handleDeletGroup(item)}
                    className="text-[20px] cursor-pointer text-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        // <div className="md:p-3 divide-y divide-slate-200">
        //   {myGroups.map((item) => (
        //     <div key={item.groupID}>
        //       <div className="flex items-center gap-x-3 py-5 ">
        //         <div className="w-[50px] h-[50px]">
        //           <img
        //             className="rounded-full  w-full h-full"
        //             src={item.groupimage}
        //             alt=""
        //           />
        //         </div>
        //         <div>
        //           <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
        //             {item.groupname}
        //           </h3>

        //           <p>{item.grouptags}</p>
        //         </div>

        //         <div className="grow">
        //           <div className="flex w-full justify-end gap-x-3">
        //             <div className="flex gap-x-2">

        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   ))}
        // </div>
      )}
    </div>
  );
};

export default Mygroups;
