import { create } from 'zustand';
import { ISalesReportStore } from './types/sale_report.store.types';
import {
  get_expense_by_dates_transmitter,
  get_expenses_by_day,
  get_products_most_selled_by_transmitter_table,
  get_sales_by_branch_and_current_month,
  get_sales_by_branch_and_current_month_table,
  // get_sales_by_branch_and_current_month_table,
  get_sales_by_day,
  get_sales_by_day_table,
  get_sales_by_month_and_year,
  get_sales_by_period,
  get_sales_by_period_chart,
  get_sales_point_of_sale_by_branch,
} from '../../services/reports/sales.reports.service';

export const salesReportStore = create<ISalesReportStore>((set) => ({
  sales_branch_month: [],
  sales_month_year: [],
  sales_by_day: 0,
  expenses: [],
  sales_table_day: [],
  data: [],
  products_most_selled: [],
  sales_by_period: undefined,
  sales_by_period_graph: undefined,
  sales_by_point_of_sale_branch: undefined,
  loading_sales_period: false,
  getSalePointOfSaleByBranch: (id, startDate, endDate) => {
    get_sales_point_of_sale_by_branch(id, startDate, endDate).then(({ data }) => {
      set({ sales_by_point_of_sale_branch: data });
    }).catch(() => {
      set({ sales_by_point_of_sale_branch: undefined });
    });
  },
  getSalesByPeriodChart(startDate, endDate) {
    get_sales_by_period_chart(startDate, endDate).then(({ data }) => {
      set({ sales_by_period_graph: data });
    }).catch(() => {
      set({ sales_by_period_graph: undefined });
    });
  },
  getSalesByPeriod(page, startDate, endDate, paymentType = "") {
    set({ loading_sales_period: true });
    get_sales_by_period(page, startDate, endDate, paymentType)
      .then(({ data }) => {
        set({ sales_by_period: data, loading_sales_period: false });
      })
      .catch(() => {
        set({ sales_by_period: undefined, loading_sales_period: false });
      });
  },
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
  getExpensesByDateTransmitter: (id: number, startDate: string, endDate: string) => {
    get_expense_by_dates_transmitter(id, startDate, endDate)
    //   .then(({ data }) => {
    //   set({})
    // }).catch(() => {

    // })
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
        set({ data: res.data.data });
      })
      .catch(() => {
        set({ data: [] });
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
