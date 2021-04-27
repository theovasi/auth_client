import { configureStore } from '@reduxjs/toolkit';
import rootReducer from "../reducers/index";

export const store = configureStore({
  reducer: {
    root: rootReducer,
  },
});
