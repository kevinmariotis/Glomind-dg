import { createSlice } from "@reduxjs/toolkit";

export const configSlice = createSlice({
  name: "config",
  initialState: {
    camposPersonalizables: {},
  },
  reducers: {
    setConfig: (state, action) => {
      state.camposPersonalizables = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setConfig } = configSlice.actions;

export default configSlice.reducer;
