import { create } from 'zustand';

import { IShippingReport } from './types/shipping_report.store.types';

import { get_shipping_report } from '@/services/reports/shipping_report.service';

export const useShippingStore = create<IShippingReport>((set) => ({
  dataReport: [],
  loading: false,
  getShippingReport(startDate, endDate) {
    try {
      set({ loading: true });
      get_shipping_report(startDate, endDate).then(({ data }) => {
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
