import { create } from 'zustand';
import { IItemsState } from './types/items.store.types';
import { get_items_by_dates, get_items_by_major } from '@/services/items.service';

export const useItemsStore = create<IItemsState>((set) => ({
  items: [],
  loadingItems: false,
  majorItems: [],
  loadingMajorAccount: false,
  getItemsByMajor(transId, startDate, endDate) {
    set({ loadingMajorAccount: true });
    return get_items_by_major(transId, startDate, endDate)
      .then((res) => {
        set({
          majorItems: res.data.majorAccounts,
          loadingMajorAccount: false,
        });

        return res.data.majorAccounts;
      })
      .catch(() => {
        set({ loadingMajorAccount: false });
        return [];
      });
  },
  getItemsByDates(transId, startDate, endDate) {
    set({ loadingItems: true });
    return get_items_by_dates(transId, startDate, endDate)
      .then((res) => {
        set({
          items: res.data.items,
          loadingItems: false,
        });

        return res.data.items;
      })
      .catch(() => {
        set({ loadingItems: false });
        return [];
      });
  },
}));
