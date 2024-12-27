import { create } from 'zustand';
import { AccountingItemsServiceStore } from './types/accounting-items.service.store.types';
import { create_item, get_accounting_items } from '@/services/accounting-items.service';

export const useAccountingItemsStore = create<AccountingItemsServiceStore>((set) => ({
  accounting_items: [],
  loading: false,
  accounting_items_pagination: {
    total: 0,
    currentPag: 1,
    nextPag: 1,
    prevPag: 1,
    totalPag: 1,
    ok: true,
    status: 200,
  },
  getAccountingItems: (page: number, limit: number, startDate: string, endDate: string) => {
    set((state) => ({
      ...state,
      loading: true,
    }));
    return get_accounting_items(page, limit, startDate, endDate)
      .then((res) => {
        if (res.data.items.length > 0) {
          set((state) => ({
            ...state,
            accounting_items: res.data.items,
            accounting_items_pagination: res.data,
            loading: false,
          }));
        } else {
          set((state) => ({
            ...state,
            accounting_items: [],
            accounting_items_pagination: {
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
        }
      })
      .catch(() => {
        set((state) => ({
          ...state,
          accounting_items: [],
          accounting_items_pagination: {
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
  addAddItem: (payload) => {
    return create_item(payload)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  },
}));
