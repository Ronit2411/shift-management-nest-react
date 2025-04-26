import { BackendAuthenticatedService } from "."
import { Shift } from "../types/shifts";

class ShiftService {
  apiService:any;
  constructor() {
    this.apiService =  BackendAuthenticatedService;
  }

  fetchShifts() {
    return this.apiService.get("/shifts");
  }

  fetchShiftById(id: string) {
    return this.apiService.get(`/shifts/${id}`);
  }

  createShift(shift: Shift) {
    return this.apiService.post(`/shifts`, shift);
  }

  updateShift(id: string, shift: Partial<Shift>) {
    return this.apiService.patch(`/shifts/${id}`, shift);
  }

  deleteShift(id: string) {
    return this.apiService.delete(`/shifts/${id}`);
  }
}

export const shiftService = new ShiftService();