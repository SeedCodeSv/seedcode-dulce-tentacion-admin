import { create } from 'zustand';

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
  get_sales_count,
  get_sales_point_of_sale_by_branch,
} from '../../services/reports/sales.reports.service';

import { ISalesReportStore } from './types/sale_report.store.types';

import {
  get_graphic_for_category_products_for_dates,
  get_graphic_sub_category_products_for_dates,
  get_sales_by_product,
} from '@/services/sales.service';

export const salesReportStore = create<ISalesReportStore>((set) => ({
  sales_branch_month: [],
  sales_month_year: [],
  sales_by_day: 0,
  expenses: [],
  sales_table_day: [],
  loading_sales_by_branch_and_month: false,
  loading_sales_by_table_date: false,
  loading_sales_month_year: false,
  data: [],
  loading_sales_by_point_of_sale_branch: false,
  products_most_selled: [],
  sales_by_period: undefined,
  sales_by_period_graph: undefined,
  sales_by_point_of_sale_branch: undefined,
  loading_sales_period: false,
  sales_count: 0,
  graphic_for_category_products_for_dates: [],
  graphic_sub_category_products_for_dates: [],
  sales_products: [],
  total_sales_product: 0,
  loading_sales_products: false,
  loading_sales_by_subcategory: false,
  getSalesProducts(id, startDate, endDate, branch) {
    set({ loading_sales_products: true, graphic_sub_category_products_for_dates: [] });
    get_sales_by_product(id, startDate, endDate, branch)
      .then(({ data }) => {
        set({
          sales_products: data.sales,
          total_sales_product: data.totalSales,
          loading_sales_products: false,
        });
      })
      .catch(() => {
        set({ sales_products: [], total_sales_product: 0, loading_sales_products: false });
      });
  },
  getGraphicSubCategoryProductsForDates(id, startDate, endDate, branch) {
    set({ loading_sales_by_subcategory: true, graphic_sub_category_products_for_dates: [] });
    get_graphic_sub_category_products_for_dates(id, startDate, endDate, branch)
      .then(({ data }) => {
        set({
          graphic_sub_category_products_for_dates: data.detailSales,
          loading_sales_by_subcategory: false,
        });
      })
      .catch(() => {
        set({ graphic_sub_category_products_for_dates: [], loading_sales_by_subcategory: false });
      });
  },
  getGraphicForCategoryProductsForDates(id,startDate, endDate, branch) {
    get_graphic_for_category_products_for_dates(id,startDate, endDate, branch)
      .then(({ data }) => {
        set({ graphic_for_category_products_for_dates: data.sales });
      })
      .catch(() => {
        set({ graphic_for_category_products_for_dates: [] });
      });
  },
  getSalesCount() {
    get_sales_count()
      .then(({ data }) => {
        set({ sales_count: data.totalSales });
      })
      .catch(() => {
        set({ sales_count: 0 });
      });
  },
  getSalePointOfSaleByBranch: (id, startDate, endDate) => {
    set({ loading_sales_by_point_of_sale_branch: true });
    get_sales_point_of_sale_by_branch(id, startDate, endDate)
      .then(({ data }) => {
        set({ sales_by_point_of_sale_branch: data, loading_sales_by_point_of_sale_branch: false });
      })
      .catch(() => {
        set({ sales_by_point_of_sale_branch: undefined, loading_sales_by_point_of_sale_branch: false });
      });
  },
  getSalesByPeriodChart(startDate, endDate) {
    get_sales_by_period_chart(startDate, endDate)
      .then(({ data }) => {
        set({ sales_by_period_graph: data });
      })
      .catch(() => {
        set({ sales_by_period_graph: undefined });
      });
  },
  getSalesByPeriod(
    page,
    limit,
    startDate,
    endDate,
    paymentType = '',
    branch = '',
    correlative = '',
    typeVoucher = '',
    pointOfSale = ''
  ) {
    set({ loading_sales_period: true, sales_by_period: undefined });
    get_sales_by_period(page, limit, startDate, endDate, paymentType, branch, correlative, typeVoucher, pointOfSale)
      .then(({ data }) => {
        set({ sales_by_period: data, loading_sales_period: false });
      })
      .catch(() => {
        set({ sales_by_period: undefined, loading_sales_period: false });
      });
  },
  getSalesTableDay: (id) => {
    set({ loading_sales_by_table_date: true });
    get_sales_by_day_table(id)
      .then(({ data }) => {
        set({ sales_table_day: data.sales, loading_sales_by_table_date: false });
      })
      .catch(() => {
        set({ sales_table_day: [], loading_sales_by_table_date: false });
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
    get_expense_by_dates_transmitter(id, startDate, endDate);
  },
  getSalesByYearAndMonth(id) {
    set({ loading_sales_month_year: true });
    get_sales_by_month_and_year(id)
      .then(({ data }) => {
        set({ sales_month_year: data.sales, loading_sales_month_year: false });
      })
      .catch(() => {
        set({ sales_month_year: [], loading_sales_month_year: false });
      });
  },
  getSalesByBranchAndMonth: (id) => {
    set({ loading_sales_by_branch_and_month: true });
    get_sales_by_branch_and_current_month(id)
      .then((res) => {
        set({ sales_branch_month: res.data.sales, loading_sales_by_branch_and_month: false });
      })
      .catch(() => {
        set({ sales_branch_month: [], loading_sales_by_branch_and_month: false });
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
