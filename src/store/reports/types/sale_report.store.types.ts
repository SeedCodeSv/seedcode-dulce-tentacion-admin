import {
  ProductoMostSelledTable,
  SaleBranchMonth,
  SaleMonthYear,
  SaleTableDay,
} from '../../../types/reports/sales.reports.types';

export interface ISalesReportStore {
  products_most_selled: ProductoMostSelledTable[];
  sales_branch_month: SaleBranchMonth[];
  sales_month_year: SaleMonthYear[];
  sales_by_day: number;
  sales_table_day: SaleTableDay[];
  getSalesTableDay: (id: number) => void;
  getSalesByDay: (id: number) => void;
  getProductMostSelledTable: (id: number, startDate: string, endDate: string) => void;
  getSalesByYearAndMonth: (id: number) => void;
  getSalesByBranchAndMonth: (id: number) => void;
}
