import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userData } from "../slices/userSlice";

const Login = () => {
  const auth = getAuth();
  const db = getDatabase();
  let data = useSelector((state) => state.userData.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleAuthetication = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        dispatch(userData(user));
        localStorage.setItem("userInfo", JSON.stringify(user));
        set(ref(db, "users/" + user.uid), {
          username: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
        });

        toast.success("Registration Success wait for redirect");
        setTimeout(() => {
          navigate("/");
        }, 1500);
        // ...
      })
      .catch((error) => {
        // // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.customData.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(error);
        // ...
      });
  };
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="h-1/2 md:w-1/2 md:h-screen bg-slate-700 flex justify-center items-center">
        <img className="" src="images/signup.svg" alt="signup" />
      </div>
      <div className="h-1/2 md:w-1/2 md:h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className=" text-[50px] font-bold font-pop text-greenLight">
            Chatly
          </h1>
          <h3 className=" font-pop text-lg text-gray-600">Hello Again!</h3>
          <button
            onClick={handleAuthetication}
            className="flex items-center gap-x-3 px-8 py-3 border-2 rounded-full mt-5 hover:bg-gray-100"
          >
            <FcGoogle className="text-lg" />
            <p className=" text-sm font-semibold">Login with Google</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
