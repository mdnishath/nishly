import React, { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineInfoCircle, AiOutlineClose } from "react-icons/ai";
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

const Mygroups = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userData.userInfo);
  const [loading, setLoading] = useState(false);
  const [myGroups, setmyGroups] = useState([]);

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

  return (
    <div className="w-full shadow-all p-5 rounded h-[45vh] overflow-y-auto scrolbar">
      <h3 className="font-pop text-[20px] md:text-[24px] text-gray-700 font-bold relative">
        My Groups
        <BiDotsVerticalRounded className="text-[30px] absolute top-0 right-0" />
      </h3>
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
                  <AiOutlineInfoCircle className="text-[30px] cursor-pointer text-greenLight" />
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
                    <AiOutlineClose
                      onClick={() => handleDeletGroup(item)}
                      className="text-[30px] cursor-pointer text-red-500"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mygroups;
