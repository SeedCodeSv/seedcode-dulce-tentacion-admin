import { create } from 'zustand';
import { toast } from 'sonner';

import {
  get_expenses_paginated,
  save_expenses,
  patch_expenses,
  delete_expenses,
  get_expense_attachment,
} from '../services/expenses.service';
import { messages } from '../utils/constants';
import { IExpensePayloads } from '../types/expenses.types';
import { get_box } from '../storage/localStorage';

import { IExpenseStore } from './types/expenses.store';

export const useExpenseStore = create<IExpenseStore>((set, get) => ({

  expense_attachments: [],
  expenses: [],
  annexes: [],
  expenses_paginated: {

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
      .then(({ data }) => set({
        expenses: data.expenses,
        expenses_paginated: {
          total: data.total,
          totalPag: data.totalPag,
          currentPag: data.currentPag,
          nextPag: data.nextPag,
          prevPag: data.prevPag,
          status: data.status,
          ok: data.ok,
        }

      }))
      .catch(() => {
        set({
          expenses_paginated: {

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
    const currentBox = Number(get_box());

    save_expenses(payload)
      .then(() => {
        get().getExpensesPaginated(currentBox, 1, 5, '');
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  patchExpenses(id, payload) {
    const currentBox = Number(get_box());

    return patch_expenses(id, payload)
      .then(({ data }) => {
        get().getExpensesPaginated(currentBox, 1, 5, '');
        toast.success(messages.success);

        return data.ok;
      })
      .catch(() => {
        toast.error(messages.error);

        return false;
      });
  },
  deleteExpenses(id) {
    const currentBox = Number(get_box());

    return delete_expenses(id)
      .then(({ data }) => {
        get().getExpensesPaginated(currentBox, 1, 5, '');
        toast.success(messages.success);

        return data.ok;
      })
      .catch(() => {
        toast.error(messages.error);

        return false;
      });
  },

  get_expenses_attachment: (id: number): void => {
    get_expense_attachment(id)
      .then(({ data }) => {
        set({
          expense_attachments: data.data
        })

      })
      .catch(() => {
        toast.error(messages.error);
      })
  }
}));
