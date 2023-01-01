import React from "react";
import { Outlet } from "react-router-dom";
import Sidbar from "./Sidbar";
import { useSelector } from "react-redux";

const Root = () => {
  let data = useSelector((state) => state.userData.userInfo);
  return (
    <>
      {data && <Sidbar />}

      <Outlet />
    </>
  );
};

export default Root;
