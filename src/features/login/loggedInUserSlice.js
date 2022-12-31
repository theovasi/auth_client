import { createSlice } from "@reduxjs/toolkit";

export const loggedInUserSlice = createSlice({
  name: "loggedInUser",
  initialState: {
    token: "",
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = "";
    },
  },
});

export const { login } = loggedInUserSlice.actions;

export default loggedInUserSlice.reducer;
