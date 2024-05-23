import { CategoryExpense } from '../types/categories_expenses.types';
import { Box } from '../types/box.types';
export interface IExpense {
  id: number;
  description: string;
  total: number;
  box: Box
  boxId: number;
  categoryExpense: CategoryExpense;
  categoryExpenseId: number;
  isActive: boolean;
}

export interface IExpensePayload {
  description: string;
  total: number;
  boxId?: number;
  categoryExpenseId: number;
}

export interface ICreacteExpense {
  description: string;
  total: number;
  boxId?: number;
  categoryExpenseId: number;
  file?: File | Blob | null;
}
export interface IExpensePayloads extends ICreacteExpense {
  file?: File | Blob | null | undefined;
}

export interface IExpensesPaginated {
  expenses: IExpense[];
  ok: boolean;
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}
