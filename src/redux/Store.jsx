import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/AuthSlice";
import configSlice from "./slices/ConfigSlice";
import cursorSlice from "./slices/CursorSlice";

const persistConfig = {
  key: "glomind-redux",
  storage,
};

const reducers = combineReducers({
  auth: authSlice,
  config: configSlice,
  cursor: cursorSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
});

export default store;
