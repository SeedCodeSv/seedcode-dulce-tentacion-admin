import {
  SaleByDay,
  SaleByProduct,
  SaleCategory,
  SaleTableDay,
  SaleYear,
} from '../../../types/reports_seller/sales_reports_seller.types';

export interface ISalesReportStore {
  sales_by_category: SaleCategory[];
  sales_by_year: SaleYear[];
  sales_by_product: SaleByProduct[];
  sales_by_day: SaleByDay[];
  sales_table_day: SaleTableDay[];
  total_sales: number;
  total_expenses: number;
  getSalesByCategory: (id: number) => void;
  getSalesByYear: (id: number) => void;
  getProductSelledByBranch: (id: number) => void;
  getSalesByDays: (id: number) => void;
  getSalesTableDay: (id: number) => void;
}
