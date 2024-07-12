import { create } from 'zustand';
import { IBranchProductReportStore } from './types/branch_product_report.store.types';
import { get_most_selled_product } from '../../services/reports/branch_product.report.service';
import { get_products_most_selled_by_transmitter_grafic } from '../../services/reports/sales.reports.service';

export const useBranchProductReportStore = create<IBranchProductReportStore>((set) => ({
  most_product_selled: [],
  data: [],
  loading_most_selled_product: false,
  getMostProductMostSelled(id) {
    set({ loading_most_selled_product: true });
    get_most_selled_product(id)
      .then(({ data }) => {
        set({ most_product_selled: data.products, loading_most_selled_product: false });
      })
      .catch(() => {
        set({ most_product_selled: [], loading_most_selled_product: false });
      });
  },
  getProductMostSelledGrafic: (id, startDate, endDate) => {
    get_products_most_selled_by_transmitter_grafic(id, startDate, endDate).then(({ data }) => {
      set({ data: data.data });
    });
  },
}));
