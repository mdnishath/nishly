import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidbar from "./Sidbar";
import Topbar from "./Topbar";

const Root = () => {
  let location = useLocation();
  console.log(location.pathname);
  return (
    <>
      {location.pathname !== "/login" && (
        <>
          <Sidbar />
          <Topbar />
        </>
      )}
      <Outlet />
    </>
  );
};

export default Root;
