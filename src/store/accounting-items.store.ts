import { create } from 'zustand';
import { AccountingItemsServiceStore } from './types/accounting-items.service.store.types';
import {
  create_item,
  delete_item,
  get_accounting_items,
  get_details,
  update_item,
} from '@/services/accounting-items.service';
import { get_accounting_item_search } from '@/storage/localStorage';

export const useAccountingItemsStore = create<AccountingItemsServiceStore>((set, get) => ({
  search_item: {
    is_first_time: true,
    page: get_accounting_item_search().page,
    limit: get_accounting_item_search().limit,
    startDate: get_accounting_item_search().startDate,
    endDate: get_accounting_item_search().endDate,
  },
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
  details: undefined,
  loading_details: false,
  getDetails(id) {
    return get_details(id)
      .then((res) => {
        if (res.data.item) {
          set((state) => ({
            ...state,
            details: res.data.item,
            loading_details: false,
          }));
        } else {
          set((state) => ({
            ...state,
            details: undefined,
            loading_details: false,
          }));
        }
      })
      .catch(() => {
        set((state) => ({
          ...state,
          details: undefined,
          loading_details: false,
        }));
      });
  },
  getAccountingItems: (page: number, limit: number, startDate: string, endDate: string) => {
    set((state) => ({
      ...state,
      loading: true,
      search_item: { page, limit, startDate, endDate, is_first_time: true },
    }));
    localStorage.setItem('accounting_items', JSON.stringify({ page, limit, startDate, endDate }));
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
  editItem: (payload, id) => {
    return update_item(payload, id)
      .then(() => {
        get().getAccountingItems(
          get().search_item.page,
          get().search_item.limit,
          get().search_item.startDate,
          get().search_item.endDate
        );
        return true;
      })
      .catch(() => {
        return false;
      });
  },
  deleteItem: (id) => {
    return delete_item(id)
      .then(() => {
        get().getAccountingItems(
          1,
          get().search_item.limit,
          get().search_item.startDate,
          get().search_item.endDate
        );
        return true;
      })
      .catch(() => {
        return false;
      });
  },
}));
