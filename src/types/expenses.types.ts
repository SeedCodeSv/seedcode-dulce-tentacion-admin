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
  attachments: Attachment[]
}
export interface Attachment {
  id: number
  path: string
  ext: string
  isActive: boolean
  expenseId: number
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

export interface IGetExpense {
  id: number;
  description: string;
  total: number;
  isActive: boolean;
  boxId: number;
  box: Box
  categoryExpenseId: number
  categoryExpense: ICategoryExpense
  file?: File | Blob | null
  expenseAttachment: {
    ext: string
    path: string

  }
}
export interface IGetExpenseAttachment {
  ok: boolean
  data: IGetData[]
  status: number
}
export interface IGetData {
  id: number
  description: string
  total: string
  isActive: boolean
  boxId: number
  categoryExpenseId: number
  attachments: IExpenseAttachment[]
}
export interface IExpenseAttachment {
  id: number
  path: string
  ext: string
  isActive: boolean
  expenseId: number
}

export interface ICategoryExpense {
  id: number
  name: string
  isActive: boolean
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
