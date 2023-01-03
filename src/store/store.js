import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice";
import searchSlice from "../slices/searchSlice";

const store = configureStore({
  reducer: {
    userData: userSlice,
    filterData: searchSlice,
  },
});

export default store;
