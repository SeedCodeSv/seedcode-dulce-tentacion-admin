import { create } from 'zustand';

import { IProductionReport } from './types/production_report_store.types';

import { get_production_report } from '@/services/reports/production_report.service';

export const useProductionReport = create<IProductionReport>((set) => ({
  dataReport: [],
  loading: false,
  getProductioReport(branchId, date) {
    try {
      set({ loading: true });
      get_production_report(branchId, date).then(({ data }) => {
        set({
          dataReport: data.data,
          loading: false,
        });
      });
    } catch (error) {
      set({
        loading: false,
        dataReport: [],
      });
    }
  },
}));
