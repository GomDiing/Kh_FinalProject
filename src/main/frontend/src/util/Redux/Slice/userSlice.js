import { createSlice } from "@reduxjs/toolkit";

// 초기값
const initialState = {
    info : {
        // userIndex : '',
        userId : '',
        userPoint : '',
    }
};

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        // 초기값의 info 에 값을 넘겨줌
        setUserInfo : (state ,action) =>{
            state.info = action.payload.data;
        }
    }
})

export const loginActions = userSlice.actions;
export default userSlice.reducer;