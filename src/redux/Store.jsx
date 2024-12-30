import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/AuthSlice'
 
const persistConfig = {
  key: 'glomind-redux',
  storage,
}

const reducers = combineReducers({
  auth: authSlice
})
 
const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
});

export default store;
