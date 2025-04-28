import { create } from 'zustand';

import { IItemsState } from './types/items.store.types';

import {
  get_items_by_daily_major,
  get_items_by_daily_major_account,
  get_items_by_dates,
  get_items_by_major,
  get_items_for_balance,
  get_list_of_major,
} from '@/services/items.service';

export const useItemsStore = create<IItemsState>((set) => ({
  items: [],
  loadingItems: false,
  majorItems: [],
  loadingMajorAccount: false,
  dailyMajorItems: [],
  loadingDailyMajor: false,
  dailyMajorItemsAccount: [],
  loadingDailyMajorAccount: false,
  majorAccounts: [],
  loadingMajorAccounts: false,
  accounts: [],
  loadingAccounts: false,
  getItemsForBalance(transmitterId, startDate, endDate) {
    set({ loadingAccounts: true });

    return get_items_for_balance(transmitterId, startDate, endDate)
      .then((res) => {
        set({
          accounts: res.data.accounts,  
          loadingAccounts: false,
        });

        return res.data.accounts;
      })
      .catch(() => {
        set({ loadingAccounts: false });

        return [];
      });
  },
  getMajorAccounts(transId) {
    set({ loadingMajorAccounts: true });
    get_list_of_major(transId)
      .then((res) => {
        set({
          majorAccounts: res.data.majorAccounts,
          loadingMajorAccounts: false,
        });

        return res.data.majorAccounts;
      })
      .catch(() => {
        set({ loadingMajorAccounts: false });

        return [];
      });
  },
  getItemsByDailyMajorAccount(transId, startDate, endDate, account) {
    set({ loadingDailyMajorAccount: true });

    return get_items_by_daily_major_account(transId, startDate, endDate, account)
      .then((res) => {
        set({
          dailyMajorItemsAccount: res.data.majorAccounts,
          loadingDailyMajorAccount: false,
        });

        return res.data.majorAccounts;
      })
      .catch(() => {
        set({ loadingDailyMajorAccount: false });

        return [];
      });
  },
  getItemsByDailyMajor(transId, startDate, endDate) {
    set({ loadingDailyMajor: true });

    return get_items_by_daily_major(transId, startDate, endDate)
      .then((res) => {
        set({
          dailyMajorItems: res.data.majorAccounts,
          loadingDailyMajor: false,
        });

        return res.data.majorAccounts;
      })
      .catch(() => {
        set({ loadingDailyMajor: false });

        return [];
      });
  },
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
