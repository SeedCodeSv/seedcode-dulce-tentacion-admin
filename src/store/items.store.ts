import { create } from 'zustand';
import { IItemsState } from './types/items.store.types';
import { get_items_by_dates } from '@/services/items.service';

export const useItemsStore = create<IItemsState>((set) => ({
  items: [],
  loadingItems: false,
  getItemsByDates(transId, startDate, endDate) {
    set({ loadingItems: true });
    return get_items_by_dates(transId, startDate, endDate)
      .then((res) => {
        set({
          items: res.data.items,
          loadingItems: false,
        });

        return res.data.items
      })
      .catch(() => {
        set({ loadingItems: false });
        return []
      });
  },
}));
