export enum ShiftType {
  CONSULTATION = "consultation",
  TELEPHONE = "telephone",
  AMBULANCE = "ambulance",
}

export interface ShiftDate {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  type: ShiftType;
}

export interface Shift {
  id?: string;
  title: string;
  description?: string;
  dates: ShiftDate[];
}

export interface ShiftFormData {
  title: string;
  description: string;
  dates: ShiftDate[];
}
