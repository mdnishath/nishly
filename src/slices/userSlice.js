const { createSlice } = require("@reduxjs/toolkit");

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
    uploding: false,
    cropimage: "",
  },
  reducers: {
    userData(state, action) {
      state.userInfo = action.payload;
    },
    uploadingData(state, action) {
      state.uploding = action.payload;
    },
    cropedData(state, action) {
      state.uploding = action.payload;
    },
  },
});

export const { userData, uploadingData, cropedData } = userSlice.actions;
export default userSlice.reducer;
