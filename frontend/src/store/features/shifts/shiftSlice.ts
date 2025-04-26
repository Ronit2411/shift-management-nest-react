import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shift } from "../../../types/shifts";
import { createShiftAsync, deleteShiftAsync, fetchShiftByIdAsync, fetchShiftsAsync, updateShiftAsync } from "./shiftAction";

interface ShiftsState {
  shifts: Shift[];
  currentShift: Shift | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  priceFilter: [number, number];
}

const initialState: ShiftsState = {
  shifts: [],
  currentShift: null,
  status: "idle",
  error: null,
  priceFilter: [0, 200],
};

const shiftsSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    setPriceFilter: (state, action: PayloadAction<[number, number]>) => {
      state.priceFilter = action.payload;
    },
    setCurrentShift: (state, action: PayloadAction<Shift | null>) => {
      state.currentShift = action.payload;
    },
    clearCurrentShift: (state) => {
      state.currentShift = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShiftsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchShiftsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shifts = action.payload.data;
      })
      .addCase(fetchShiftsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(fetchShiftByIdAsync.fulfilled, (state, action) => {
        state.currentShift = action.payload;
      })
      .addCase(createShiftAsync.fulfilled, (state, action) => {
        state.shifts.push(action.payload);
      })
      .addCase(updateShiftAsync.fulfilled, (state, action) => {
        const index = state.shifts.findIndex(
          (shift) => shift.id === action.payload.id
        );
        if (index !== -1) {
          state.shifts[index] = action.payload;
        }
        state.currentShift = action.payload;
      })
      .addCase(deleteShiftAsync.fulfilled, (state, action) => {
        state.shifts = state.shifts.filter(
          (shift) => shift.id !== action.payload
        );
      });
  },
});

export const { setPriceFilter, setCurrentShift, clearCurrentShift } =
  shiftsSlice.actions;
export default shiftsSlice.reducer;