import React from "react";
import { useSelector } from "react-redux";

const Topbar = () => {
  let data = useSelector((state) => state.userData.userInfo);
  return (
    <div className="bg-white p-2 shadow-lg md:ml-[100px]">
      <div className="flex items-center justify-end gap-x-5">
        <h3 className="text-lg font-semibold">{data.displayName}</h3>
        <div className=" mr-3 h-[50px] w-[50px] rounded-full shadow-lg border border-primary">
          <img
            className="w-full rounded-full"
            src={data.photoURL}
            alt="profile"
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
