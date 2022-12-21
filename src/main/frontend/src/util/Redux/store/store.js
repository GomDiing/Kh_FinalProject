import {combineReducers ,configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

import userReducer from '../Slice/userSlice'
import seatReducer from '../Slice/seatIndexSlice'

const reducers = combineReducers({
    user : userReducer, 
    seat : seatReducer
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