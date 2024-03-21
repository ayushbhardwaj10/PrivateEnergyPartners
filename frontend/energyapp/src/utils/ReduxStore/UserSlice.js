import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    fullName: "",
    userName: "",
    loginStatus: false,
  },
  reducers: {
    login: (state, action) => {
      const newState = { ...state };
      newState.fullName = action.payload.fullName;
      newState.userName = action.payload.userName;
      newState.loginStatus = action.payload.loginStatus;
      return newState;
    },
    logout: (state) => {
      const newState = { ...state };
      newState.fullName = "";
      newState.userName = "";
      newState.loginStatus = false;
      return newState;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
