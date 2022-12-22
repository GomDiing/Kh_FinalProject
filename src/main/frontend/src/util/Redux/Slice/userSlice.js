import { createSlice } from "@reduxjs/toolkit";

// 초기값
const initialState = {
    info : {
        userIndex : undefined,
        userId : undefined,
        userName : undefined,
        userPoint : 0,
        userEmail : undefined,
        userProvider_type : undefined,
    }
};

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        // 초기값의 info 에 값을 넘겨줌
        setUserInfo : (state ,action) =>{
            state.info = action.payload.data;
        },
        setUserPoint : (state, action) => {
            state.info.userPoint = action.payload;
        }
    }
})

export const loginActions = userSlice.actions;
export default userSlice.reducer;