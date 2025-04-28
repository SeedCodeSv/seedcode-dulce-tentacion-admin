import { create } from 'zustand';

import { get_account_receivable_list, get_accounts_receivable, get_payments_by_account } from '../services/account_receivable.service';

import { IUseAccountReceivableStore } from './types/accounts_receivable.store.types';

export const useAccountReceivableStore = create<IUseAccountReceivableStore>((set) => ({
  accounts: [],
  payments: [],
  accounts_receivable_paginated: {
    accounts: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },

  getAccountsReceivableList() {
    get_account_receivable_list()
      .then(({ data }) => {
        set((state) => ({ ...state, accounts: data.accounts }));
      })
      .catch(() => {
        set({ accounts: [] });
      });
  },
  getAccountsReceivablePaginated(page: number, limit: number) {
    get_accounts_receivable(page, limit)
      .then((data) => {
        set({ accounts_receivable_paginated: data.data });
      })
      .catch(() => {
        set({
          accounts_receivable_paginated: {
            accounts: [],
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

  getPaymentsByAccount(id: number) {
    get_payments_by_account(id)
      .then(({ data }) => {
        set({ payments: data.payments });
      })
      .catch(() => {
        set({ payments: [] });
      });
  },
}));