import { create } from 'zustand';
import { IExpenseStore } from './types/expenses.store';
import {
  get_expenses_paginated,
  save_expenses,
  patch_expenses,
  delete_expenses,
} from '../services/expenses.service';
import { toast } from 'sonner';
import { messages } from '../utils/constants';
import { IExpensePayloads } from '../types/expenses.types';

export const useExpenseStore = create<IExpenseStore>((set, get) => ({
  expenses_paginated: {
    expenses: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },

  getExpensesPaginated(idBox, page, limit, category) {
    get_expenses_paginated(idBox, page, limit, category)
      .then(({ data }) => set({ expenses_paginated: data }))
      .catch(() => {
        set({
          expenses_paginated: {
            expenses: [],
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 404,
            ok: false,
          },
        });
      });
  },
  postExpenses: (payload: IExpensePayloads) => {
    save_expenses(payload)
      .then(() => {
        get().getExpensesPaginated(1, 1, 5, '');
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  patchExpenses(id, payload) {
    return patch_expenses(id, payload)
      .then(({ data }) => {
        get().getExpensesPaginated(1, 1, 5, '');
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.error(messages.error);
        return false;
      });
  },
  deleteExpenses(id) {
    return delete_expenses(id)
      .then(({ data }) => {
        get().getExpensesPaginated(1, 1, 5, '');
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.error(messages.error);
        return false;
      });
  },
}));
