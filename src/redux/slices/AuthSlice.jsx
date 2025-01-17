import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  showApp: false,
  showIntro: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setShowIntro: (state, action) => {
      state.showIntro = action.payload;
    },
    setShowApp: (state, action) => {
      state.showApp = action.payload;
    },
    setAuth: (state) => {
      state.isAuth = true;
    },
    setLogout: (state) => {
      state.isAuth = false;
      state.showApp = false;
      state.showIntro = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setShowIntro, setShowApp, setAuth, setLogout } =
  authSlice.actions;

export default authSlice.reducer;
