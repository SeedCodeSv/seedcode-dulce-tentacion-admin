import { IExpensesPaginated, IExpensePayload, IExpensePayloads, IGetData } from '../../types/expenses.types';

export interface IExpenseStore {
  expense_attachments: IGetData[]
  expenses_paginated: IExpensesPaginated;
  postExpenses: (payload: IExpensePayloads) => void;
  getExpensesPaginated: (idBox: number, page: number, limit: number, category: string) => void;
  patchExpenses: (id: number, payload: IExpensePayload) => Promise<boolean>;
  deleteExpenses: (id: number) => Promise<boolean>;
  get_expenses_attachment: (id: number) => void
}
