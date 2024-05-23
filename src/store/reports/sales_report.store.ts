import { create } from 'zustand';
import { ISalesReportStore } from './types/sale_report.store.types';
import {
  get_sales_by_branch_and_current_month,
  get_sales_by_day,
  get_sales_by_day_table,
  get_sales_by_month_and_year,
} from '../../services/reports/sales.reports.service';

export const salesReportStore = create<ISalesReportStore>((set) => ({
  sales_branch_month: [],
  sales_month_year: [],
  sales_by_day: 0,
  sales_table_day: [],
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
}));
