import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  showIntro: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setShowIntro: (state, action) => {
      state.showIntro = action.payload;
    },
    setAuth: (state) => {
      state.isAuth = true;
    },
    setLogout: (state) => {
      state.isAuth = false;
      state.showIntro = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setShowIntro, setAuth, setLogout } =
  authSlice.actions;

export default authSlice.reducer;
