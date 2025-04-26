import { configureStore } from "@reduxjs/toolkit";
import shiftsReducer from "./features/shifts/shiftSlice";

export const store = configureStore({
  reducer: {
    shifts: shiftsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
