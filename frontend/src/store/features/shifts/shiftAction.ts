import { createAsyncThunk } from "@reduxjs/toolkit";
import { shiftService } from "../../../services/shift";
import { Shift } from "../../../types/shifts";

export const fetchShiftsAsync = createAsyncThunk(
  "shifts/fetchShifts",
  async () => {
    return await shiftService.fetchShifts();
  }
);

export const fetchShiftByIdAsync = createAsyncThunk(
  "shifts/fetchShiftById",
  async (id: string) => {
    return await shiftService.fetchShiftById(id);
  }
);

export const createShiftAsync = createAsyncThunk(
  "shifts/createShift",
  async (shift: Shift) => {
    return await shiftService.createShift(shift);
  }
);

export const updateShiftAsync = createAsyncThunk(
  "shifts/updateShift",
  async ({ id, shift }: { id: string; shift: Partial<Shift> }) => {
    return await shiftService.updateShift(id, shift);
  }
);

export const deleteShiftAsync = createAsyncThunk(
  "shifts/deleteShift",
  async (id: string) => {
    await shiftService.deleteShift(id);
    return id;
  }
);
