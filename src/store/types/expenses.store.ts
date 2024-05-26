import {  IExpensePayload, IExpensePayloads, IGetData, IExpense } from '../../types/expenses.types';
import { IPagination } from '../../types/global.types';

export interface IExpenseStore {
  expense_attachments: IGetData[]
  expenses : IExpense[]
  expenses_paginated: IPagination;
  postExpenses: (payload: IExpensePayloads) => void;
  getExpensesPaginated: (idBox: number, page: number, limit: number, category: string) => void;
  patchExpenses: (id: number, payload: IExpensePayload) => Promise<boolean>;
  deleteExpenses: (id: number) => Promise<boolean>;
  get_expenses_attachment: (id: number) => void
}
