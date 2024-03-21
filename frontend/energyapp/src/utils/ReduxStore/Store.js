import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";

const Store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default Store;
