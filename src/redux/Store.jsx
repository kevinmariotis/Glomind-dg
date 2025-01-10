import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/AuthSlice";
import configSlice from "./slices/ConfigSlice";

const persistConfig = {
  key: "glomind-redux",
  storage,
};

const reducers = combineReducers({
  auth: authSlice,
  config: configSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
});

export default store;
