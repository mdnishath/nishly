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
    console.log(item);
    setShow(true);

    onValue(ref(db, "groupJoinRequestList"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item2) => {
        // arr.push({ ...item2.val(), joinID: item2.key });
        // console.log();
        if (item2.val().groupAdminID === item.adminid) {
          arr.push({ ...item2.val(), joinID: item2.key });
        }
      });

      setGroupGoinList(arr);
    });
  };

  const addGroupMembers = (item) => {
    // console.log(item);
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

  useEffect(() => {
    onValue(ref(db, "groupmembers"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        // console.log(item.val());
        if (data.uid === item.val().groupAdminID) {
          arr.push({ ...item.val(), key: item.key });
        }
      });

      setGroupMembers(arr);
    });
  }, []);

  const showGroupMembers = () => {
    setShowMembers(true);
  };

  const deletFromGroup = (item) => {
    remove(ref(db, "groupmembers/" + item.key));
  };
  // console.log(groupMembers);
  return (
    <div className="w-full shadow-all p-5 rounded h-[45vh] overflow-y-auto scrolbar">
      <h3 className="font-pop text-[20px] md:text-[24px] text-gray-700 font-bold relative">
        My Groups
        {showMembers ? (
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="text-lg font-bold absolute top-0 right-0 font-pop text-greenLight"
          >
            Go Back
          </button>
        ) : show ? (
          // <AiOutlineClose

          //   className="text-[30px] font-bold absolute top-0 right-0 font-pop text-red-500 cursor-pointer"
          // />
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
      </h3>
      <div className="md:p-3 divide-y divide-slate-200">
        {myGroups.map((item) => (
          <div key={item.groupID}>
            {showMembers ? (
              groupMembers.map((gm) => (
                <div key={gm.key}>
                  <div className="flex items-center gap-x-3 py-5 ">
                    <div className="w-[50px] h-[50px]">
                      <img
                        className="rounded-full  w-full h-full"
                        src={gm.memberImage}
                        alt=""
                      />
                    </div>
                    <div>
                      <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
                        {gm.memberName}
                      </h3>

                      <p>{gm.memberEmail}</p>
                    </div>

                    <div className="grow">
                      <div className="flex w-full justify-end gap-x-3">
                        {loading ? (
                          <ThreeDots
                            height="80"
                            width="80"
                            radius="9"
                            color="#4fa94d"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true}
                          />
                        ) : (
                          <div className="flex gap-x-2">
                            <BsTrash
                              onClick={() => deletFromGroup(gm)}
                              className="text-[24px] cursor-pointer text-red-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>
                {show ? (
                  groupJoinList.map((rq) => (
                    <div key={rq.groupID}>
                      <div className="flex items-center gap-x-3 py-5 ">
                        <div className="w-[50px] h-[50px]">
                          <img
                            className="rounded-full  w-full h-full"
                            src={rq.senderImage}
                            alt=""
                          />
                        </div>
                        <div>
                          <h3 className="font-pop text-sm md:text-lg  text-gray-800 font-bold">
                            {rq.senderName}
                          </h3>

                          <p>{rq.senderEmail}</p>
                        </div>

                        <div className="grow">
                          <div className="flex w-full justify-end gap-x-3">
                            {loading ? (
                              <ThreeDots
                                height="80"
                                width="80"
                                radius="9"
                                color="#4fa94d"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClassName=""
                                visible={true}
                              />
                            ) : (
                              <div className="flex gap-x-2">
                                <AiOutlineCheck
                                  onClick={() => addGroupMembers(rq)}
                                  className="text-[24px] cursor-pointer text-greenLight"
                                />

                                <BsTrash
                                  onClick={() => deletGroupRequest(rq)}
                                  className="text-[24px] cursor-pointer text-red-500"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
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
                          {loading ? (
                            <ThreeDots
                              height="80"
                              width="80"
                              radius="9"
                              color="#4fa94d"
                              ariaLabel="three-dots-loading"
                              wrapperStyle={{}}
                              wrapperClassName=""
                              visible={true}
                            />
                          ) : (
                            <div className="flex gap-x-2">
                              <AiOutlineInfoCircle
                                onClick={showGroupMembers}
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
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mygroups;
