import { create } from 'zustand';
import { IShoppingReportStore } from './types/shopping_reports.store.types';
import { get_branch_shopping_annexes, get_branch_shopping_report } from '@/services/shopping_report.service';

export const useShoppingReportsStore = create<IShoppingReportStore>((set) => ({
  shoppings: [],
  annexes_list: [],
  loading: false,
  onGetShoppingReports: (branch: number, month: string) => {
    set({ loading: true });
    get_branch_shopping_report(branch, month)
      .then((response) => {
        set({ shoppings: response.data.shoppings, loading: false });
      })
      .catch(() => {
        set({ shoppings: [], loading: false });
      });
  },
  onGetAnnexes(branch, startDate, endDate) {
    get_branch_shopping_annexes(branch, startDate, endDate).then((response) => {
      set({ annexes_list: response.data.shoppings });
    }).catch(() => {
      set({ annexes_list: [] });
    });
  },
}));
