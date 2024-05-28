import { create } from 'zustand';
import { ISalesReportStore } from './types/sale_report.store.types';
import {
  get_expenses_by_day,
  get_products_most_selled_by_transmitter_table,
  get_sales_by_branch_and_current_month,
  get_sales_by_branch_and_current_month_table,
  get_sales_by_day,
  get_sales_by_day_table,
  get_sales_by_month_and_year,
} from '../../services/reports/sales.reports.service';

export const salesReportStore = create<ISalesReportStore>((set) => ({
  sales_branch_month: [],
  sales_month_year: [],
  sales_by_day: 0,
  expenses: [],
  sales_table_day: [],
  sales: [],
  products_most_selled: [],
  getSalesTableDay: (id) => {
    get_sales_by_day_table(id)
      .then(({ data }) => {
        set({ sales_table_day: data.sales });
      })
      .catch(() => {
        set({ sales_table_day: [] });
      });
  },
  getSalesByDay(id) {
    get_sales_by_day(id)
      .then(({ data }) => {
        set({ sales_by_day: data.sales });
      })
      .catch(() => {
        set({ sales_by_day: 0 });
      });
  },
  getProductMostSelledTable: (id, startDate: string, endDate: string, branchId: number) => {
    get_products_most_selled_by_transmitter_table(id, startDate, endDate, branchId)
      .then(({ data }) => {
        set({ products_most_selled: data.products });
      })
      .catch(() => {
        set({ products_most_selled: [] });
      });
  },
  getSalesByYearAndMonth(id) {
    get_sales_by_month_and_year(id)
      .then(({ data }) => {
        set({ sales_month_year: data.sales });
      })
      .catch(() => {
        set({ sales_month_year: [] });
      });
  },
  getSalesByBranchAndMonth: (id) => {
    get_sales_by_branch_and_current_month(id)
      .then((res) => {
        set({ sales_branch_month: res.data.sales });
      })
      .catch(() => {
        set({ sales_branch_month: [] });
      });
  },
  getSalesByTransmitter: (id, startDate: string, endDate: string) => {
    get_sales_by_branch_and_current_month_table(id, startDate, endDate)
      .then((res) => {
        set({ sales: res.data.sales });
      })
      .catch(() => {
        set({ sales: [] });
      });
  },

  getSalesExpenseByDate: (id, startDate: string, endDate: string) => {
    get_expenses_by_day(id, startDate, endDate)
      .then((res) => {
        set({ expenses: res.data.expenses });
      })
      .catch(() => {
        set({ expenses: [] });
      });
  },
}));
