import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    showIntro: false,
  },
  reducers: {
    setShowIntro: (state, action) => {
      state.showIntro = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setShowIntro } = authSlice.actions

export default authSlice.reducer