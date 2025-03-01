import { create } from 'zustand';
import { AccountingItemsServiceStore } from './types/accounting-items.service.store.types';
import {
  create_item,
  delete_item,
  get_accounting_items,
  get_details,
  get_report_for_item,
  update_and_delete,
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
    typeItem: get_accounting_item_search().typeItem,
    typeOrder: get_accounting_item_search().typeOrder,
  },
  report_for_item: [],
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
  updateAndDeleteItem(id, payload) {
    return update_and_delete(payload, id)
      .then((res) => {
        return res.data.ok;
      })
      .catch(() => {
        return false;
      });
  },
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
  getAccountingItems: (
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
    typeItem: string,
    typeOrder: string
  ) => {
    set((state) => ({
      ...state,
      loading: true,
      search_item: { page, limit, startDate, endDate, typeItem, is_first_time: true, typeOrder},
    }));
    localStorage.setItem(
      'accounting_items',
      JSON.stringify({ page, limit, startDate, endDate, typeItem, typeOrder })
    );
    return get_accounting_items(page, limit, startDate, endDate, typeItem, typeOrder)
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
      .then((data) => {
        return data.data.item;
      })
      .catch(() => {
        return undefined;
      });
  },
  editItem: (payload, id) => {
    return update_item(payload, id)
      .then(() => {
        get().getAccountingItems(
          get().search_item.page,
          get().search_item.limit,
          get().search_item.startDate,
          get().search_item.endDate,
          get().search_item.typeItem,
          get().search_item.typeOrder
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
          get().search_item.endDate,
          get().search_item.typeItem,
          get().search_item.typeOrder
        );
        return true;
      })
      .catch(() => {
        return false;
      });
  },
  getReportForItem(id) {
    return get_report_for_item(id)
      .then((res) => {
        if (res.data) {
          set((state) => ({
            ...state,
            report_for_item: res.data,
            loading_details: false,
          }));
        } else {
          set((state) => ({
            ...state,
            report_for_item: undefined,
            loading_details: false,
          }));
        }
      })
      .catch(() => {
        set((state) => ({
          ...state,
          report_for_item: undefined,
          loading_details: false,
        }));
      });
  },
}));
