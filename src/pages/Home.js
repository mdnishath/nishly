import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import Grouplist from "../components/Grouplist";
import Friendrequest from "../components/Friendrequest";
import Friends from "../components/Friends";
import Mygroups from "../components/Mygroups";
import Userlist from "../components/Userlist";
import Blocklist from "../components/Blocklist";
import Sidbar from "../components/Sidbar";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { userData } from "../slices/userSlice";
// import Tooltip from "../lib/Tooltip/TolTip";

const Home = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let data = useSelector((state) => state.userData.userInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
    if (!data) {
      navigate("/login");
    }
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        dispatch(userData(user));
        localStorage.setItem("userInfo", JSON.stringify(user));
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // const uid = user.uid;
        if (!data) {
          navigate("/login");
        }
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);
  // //console.log(userInfo);
  return (
    <>
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
        <div className="flex ">
          <div className="flex flex-col md:flex-row ml-[100px] p-5 w-full gap-x-10 gap-y-10">
            <div className=" md:w-2/6 flex flex-col gap-y-10">
              <Grouplist />
              <Friendrequest />
            </div>
            <div className=" md:w-2/6 flex flex-col gap-y-10">
              <Friends />
              <Mygroups />
            </div>
            <div className=" md:w-2/6 flex flex-col gap-y-10">
              <Userlist />
              <Blocklist />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
