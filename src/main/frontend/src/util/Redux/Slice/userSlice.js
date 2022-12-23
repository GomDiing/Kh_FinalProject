import { createSlice } from "@reduxjs/toolkit";

// 초기값
const initialState = {
    info : {
        userIndex : undefined,
        userId : undefined,
        userPoint : 0,
        userName : undefined,
        userEmail : undefined,
        userProvider_type : undefined,
        userRole : undefined,
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
            state.info = action.payload;
        }
    }
})

export const loginActions = userSlice.actions;
export default userSlice.reducer;