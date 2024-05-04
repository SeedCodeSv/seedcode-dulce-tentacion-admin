import { Transmitter } from "./categories.types";
export interface Expense {
  id: number;
  name: string;
  isActive: boolean;
  transmitter: Transmitter;
  transmitterId: number;
}
export interface ExpensePayload {
  name: string;
  transmitterId: number;
}
export interface IGetExpensesList {
  categoryExpenses: Expense[];
  ok: boolean;
  message: string;
}
export interface IGetExpensesPaginated {
  ok: boolean;
  categoryExpenses: Expense[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}
