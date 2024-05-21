import {
  IExpensesPaginated,
  IExpensePayload,
  IExpensePayloads,
} from "../../types/expenses.types";

export interface IExpenseStore {
  expenses_paginated: IExpensesPaginated;
  postExpenses: (payload: IExpensePayloads) => void;
  getExpensesPaginated: (idBox: number, page: number, limit: number, category: string) => void;
  patchExpenses: (id: number, payload: IExpensePayload) => Promise<boolean>;
  deleteExpenses: (id: number) => Promise<boolean>;
}
