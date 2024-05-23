import { Transmitter } from './categories.types';
export interface CategoryExpense {
  id: number;
  name: string;
  isActive: boolean;
  transmitter: Transmitter;
  transmitterId: number;
}
export interface CategoryExpensePayload {
  name: string;
  transmitterId: number;
}
export interface IGetCategoryExpensesList {
  categoryExpenses: CategoryExpense[];
  ok: boolean;
  message: string;
}
export interface IGetCategoryExpensesPaginated {
  ok: boolean;
  categoryExpenses: CategoryExpense[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}
