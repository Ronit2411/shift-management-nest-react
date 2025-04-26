import { RootState } from "../..";
import { createSelector } from "@reduxjs/toolkit";

export const selectAllShifts = (state: RootState) => state.shifts.shifts;
export const selectCurrentShift = (state: RootState) =>
  state.shifts.currentShift;
export const selectShiftsStatus = (state: RootState) => state.shifts.status;
export const selectShiftsError = (state: RootState) => state.shifts.error;
export const selectPriceFilter = (state: RootState) => state.shifts.priceFilter;

export const selectFilteredShifts = createSelector(
  [selectAllShifts, selectPriceFilter],
  (shifts, priceFilter) => {
    return shifts.filter((shift) => {
      const shiftMinPrice = Math.min(...shift.dates.map((date) => date.price));
      const shiftMaxPrice = Math.max(...shift.dates.map((date) => date.price));

      return shiftMaxPrice >= priceFilter[0] && shiftMinPrice <= priceFilter[1];
    });
  }
);
