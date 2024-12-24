import { create } from 'zustand';
import { TypeOfAccountStore } from './types/type-of-account.store.types';
import { get_type_of_accounts } from '@/services/type-of-account.service';

export const useTypeOfAccountStore = create<TypeOfAccountStore>((set) => ({
  type_of_account: [],
  loading: false,
  type_of_account_pagination: {
    total: 0,
    currentPag: 1,
    nextPag: 1,
    prevPag: 1,
    totalPag: 1,
    ok: true,
    status: 200,
  },
  getTypeOfAccounts: (page: number, limit: number, name: string) => {
    set((state) => ({
      ...state,
      loading: true,
    }));
    get_type_of_accounts(page, limit, name)
      .then((res) => {
        set((state) => ({
          ...state,
          type_of_account: res.data.typeOfAccounts,
          type_of_account_pagination: res.data,
          loading: false,
        }));
      })
      .catch(() => {
        set((state) => ({
          ...state,
          type_of_account: [],
          type_of_account_pagination: {
            total: 0,
            currentPag: 1,
            nextPag: 1,
            prevPag: 1,
            totalPag: 1,
            ok: false,
            status: 400,
          },
          loading: false,
        }));
      });
  },
}));
