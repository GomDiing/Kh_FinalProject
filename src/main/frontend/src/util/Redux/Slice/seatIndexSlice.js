import { createSlice } from "@reduxjs/toolkit";

// 초기값
const initialState = {
    index : undefined,
};

const seatSlice = createSlice({
    name : 'seat',
    initialState,
    reducers : {
        // 초기값의 info 에 값을 넘겨줌
        setSeatInfo : (state ,action) =>{
            state.index = action.payload;
        }
    }
})

export const seatIndexAction = seatSlice.actions;
export default seatSlice.reducer;