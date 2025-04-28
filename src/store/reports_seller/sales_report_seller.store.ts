import { create } from 'zustand';

import {
  compare_sales_current,
  get_sales_by_Product,
  get_sales_by_category,
  get_sales_by_day_table,
  get_sales_by_year,
} from '../../services/reports_seller/sales_reports_seller.service';

import { ISalesReportStore } from './types/sales_reports_seller.store.types';

export const salesReportStore = create<ISalesReportStore>((set) => ({
  sales_by_category: [],
  sales_by_year: [],
  sales_by_product: [],
  sales_by_day: [],
  sales_table_day: [],
  total_sales: 0,
  total_expenses: 0,
  getSalesTableDay: (id) => {
    get_sales_by_day_table(id)
      .then(({ data }) => {
        set({
          sales_table_day: data.sales,
          total_sales: data.total,
          total_expenses: data.expenses,
        });
      })
      .catch(() => {
        set({ sales_table_day: [], total_sales: 0, total_expenses: 0 });
      });
  },
  getSalesByCategory: (id) => {
    get_sales_by_category(id)
      .then(({ data }) => {
        set({ sales_by_category: data.categories });
      })
      .catch(() => {
        set({ sales_by_category: [] });
      });
  },

  getSalesByYear: (id) => {
    get_sales_by_year(id)
      .then((res) => {
        set({ sales_by_year: res.data.sales });
      })
      .catch(() => {
        set({ sales_by_year: [] });
      });
  },

  getProductSelledByBranch: (id) => {
    get_sales_by_Product(id)
      .then((res) => {
        set({ sales_by_product: res.data.products });
      })
      .catch(() => {
        set({ sales_by_product: [] });
      });
  },

  getSalesByDays: (id) => {
    compare_sales_current(id)
      .then((res) => {
        set({ sales_by_day: res.data.salesByDay });
      })
      .catch(() => {
        set({ sales_by_day: [] });
      });
  },
}));
