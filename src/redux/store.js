import { configureStore } from "@reduxjs/toolkit";
import nameReducer from "../redux/nameSlice";

export const store = configureStore({
  reducer: {
    name: nameReducer,
  },
});
