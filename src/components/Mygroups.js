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
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { userData } from "../slices/userSlice";
import Grouplist from "./Grouplist";

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
    <div className="w-full shadow-all p-5 rounded h-[45vh] overflow-y-auto scrolbar">
      <div className="flex justify-between gap-x-2 items-center relative">
        <h3 className="font-pop text-[20px] md:text-[24px] text-gray-700 font-bold relative inline-block">
          My Group
        </h3>
        {showMembers ? (
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="text-lg font-bold absolute top-0 right-0 font-pop text-greenLight"
          >
            Go Back
          </button>
        ) : show ? (
          <button
            onClick={() => setShow(!show)}
            className="text-lg font-bold absolute top-0 right-0 font-pop text-greenLight"
          >
            Go Back
          </button>
        ) : (
          <button className="text-lg font-bold absolute top-0 right-0 font-pop text-greenLight">
            Group Info
          </button>
        )}
      </div>
      {}
      {showMembers ? (
        groupMembers.length > 0 ? (
          <div className="md:p-3 divide-y divide-slate-200">
            {groupMembers.map((gr, gid) => (
              <div key={gr.gid}>
                <div className="flex items-center gap-x-3 py-5 ">
                  <div className="w-[50px] h-[50px]">
                    <img
                      className="rounded-full  w-full h-full"
                      src={gr.memberImage}
                      alt=""
                    />
                  </div>
                  <div>
                    <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
                      {gr.memberName}
                    </h3>

                    {/* <p>{gr.senderName}</p> */}
                  </div>

                  <div className="grow">
                    <div className="flex w-full justify-end gap-x-3">
                      <div className="flex gap-x-2">
                        <BsTrash
                          onClick={() => deletFromGroup(gr)}
                          className="text-[24px] cursor-pointer text-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          "Not Found"
        )
      ) : show ? (
        <div className="md:p-3 divide-y divide-slate-200">
          {groupJoinList.length > 0
            ? groupJoinList.map((jn, index) => (
                <div key={jn.index}>
                  <div className="flex items-center gap-x-3 py-5 ">
                    <div className="w-[50px] h-[50px]">
                      <img
                        className="rounded-full  w-full h-full"
                        src={jn.senderImage}
                        alt=""
                      />
                    </div>
                    <div>
                      <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
                        {jn.senderName}
                      </h3>

                      {/* <p></p> */}
                    </div>

                    <div className="grow">
                      <div className="flex w-full justify-end gap-x-3">
                        <div className="flex gap-x-2">
                          <AiOutlineCheck
                            onClick={() => addGroupMembers(jn)}
                            className="text-[24px] cursor-pointer text-greenLight"
                          />

                          <BsTrash
                            onClick={() => deletGroupRequest(jn)}
                            className="text-[24px] cursor-pointer text-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : "No request found"}
        </div>
      ) : (
        <div className="md:p-3 divide-y divide-slate-200">
          {myGroups.map((item) => (
            <div key={item.groupID}>
              <div className="flex items-center gap-x-3 py-5 ">
                <div className="w-[50px] h-[50px]">
                  <img
                    className="rounded-full  w-full h-full"
                    src={item.groupimage}
                    alt=""
                  />
                </div>
                <div>
                  <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
                    {item.groupname}
                  </h3>

                  <p>{item.grouptags}</p>
                </div>

                <div className="grow">
                  <div className="flex w-full justify-end gap-x-3">
                    <div className="flex gap-x-2">
                      <AiOutlineInfoCircle
                        onClick={() => showGroupMembers(item)}
                        className="text-[30px] cursor-pointer text-greenLight"
                      />
                      <AiOutlineUsergroupAdd
                        onClick={() => getGroupRequest(item)}
                        className="text-[30px] cursor-pointer text-greenLight"
                      />
                      <AiOutlineClose
                        onClick={() => handleDeletGroup(item)}
                        className="text-[30px] cursor-pointer text-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mygroups;
