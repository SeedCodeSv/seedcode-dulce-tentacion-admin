import { create } from 'zustand';
import { IShoppingReportStore } from './types/shopping_reports.store.types';
import { get_branch_shopping_report } from '@/services/shopping_report.service';

export const useShoppingReportsStore = create<IShoppingReportStore>((set) => ({
  shoppings: [],
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
}));
