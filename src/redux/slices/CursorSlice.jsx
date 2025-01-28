import { createSlice } from "@reduxjs/toolkit";

export const cursorSlice = createSlice({
  name: "cursor",
  initialState: {
    isImage: false,
    urlImage: "",
  },
  reducers: {
    setImage: (state, action) => {
      state.isImage = action.payload.isImage;
      state.urlImage = action.payload.urlImage;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setImage } = cursorSlice.actions;

export default cursorSlice.reducer;
