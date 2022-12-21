import {combineReducers ,configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

import userReducer from '../Slice/userSlice'

const reducers = combineReducers({
    user : userReducer,
});

const persistConfig = {
    key : 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig , reducers);

const store = configureStore({
    reducer : persistedReducer,
    devTools : process.env.NODE_ENV !== 'production',
    middleware : [thunk],
});

export default store;