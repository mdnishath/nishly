const { createSlice } = require("@reduxjs/toolkit");

const searchSlice = createSlice({
  name: "user",
  initialState: {
    data: [],
  },
  reducers: {
    searchData(state, action) {
      //   state = [...state, action.payload];
      // console.log(action.payload);
      state.data = action.payload;
    },
  },
});

export const { searchData } = searchSlice.actions;
export default searchSlice.reducer;
