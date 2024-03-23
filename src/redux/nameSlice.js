import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : [],
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state, action) => {
      state.value.push(action.payload);
    },
  },
});

export const { increment } = counterSlice.actions;

export default counterSlice.reducer;
