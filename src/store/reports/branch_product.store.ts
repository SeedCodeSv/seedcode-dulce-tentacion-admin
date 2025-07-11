import { create } from 'zustand';

import { get_most_selled_product, get_report_product_loss } from '../../services/reports/branch_product.report.service';
import { get_products_most_selled_by_transmitter_grafic } from '../../services/reports/sales.reports.service';

import { IBranchProductReportStore } from './types/branch_product_report.store.types';

import { initialPagination } from '@/utils/utils';

export const useBranchProductReportStore = create<IBranchProductReportStore>((set) => ({
  most_product_selled: [],
  data: [],
  loading_most_selled_product: false,
  productsLoss: {
    productLoss: [],
    ...initialPagination
  },
  loadingProductLoss: false,
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
  async getProductsLoss(search) {
    set({loadingProductLoss: true})

    return await get_report_product_loss(search)
      .then(({ data }) => {
        set({ productsLoss: data, loadingProductLoss: false })

        return { ok: true, productsLoss: data }
      }).catch(() => {
        set({
          productsLoss: {
            ...initialPagination,
            productLoss: []
          },
          loadingProductLoss: false
        })

        return {
          ok: true, productsLoss: {
            ...initialPagination,
            productLoss: []
          }
        }
      })
  },
}));
