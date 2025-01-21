import { createSlice } from "@reduxjs/toolkit";

export const configSlice = createSlice({
  name: "config",
  initialState: {
    camposPersonalizablesCategorias: {},
    camposPersonalizablesCursos: {},
  },
  reducers: {
    setConfig: (state, action) => {
      state.camposPersonalizablesCategorias =
        action.payload.camposPersonalizablesCategorias;
      state.camposPersonalizablesCursos =
        action.payload.camposPersonalizablesCursos;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setConfig } = configSlice.actions;

export default configSlice.reducer;
