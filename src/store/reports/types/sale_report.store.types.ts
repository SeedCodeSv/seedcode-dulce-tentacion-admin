import { IDataExpense, ISalesData } from '../../../types/reports/branch_product.reports';
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
  expenses: IDataExpense[];
  sales_table_day: SaleTableDay[];
  sales: ISalesData[];
  getSalesTableDay: (id: number) => void;

  getSalesByDay: (id: number) => void;
  getSalesExpenseByDate: (id: number, startDate: string, endDate: string) => void;
  getSalesByTransmitter: (id: number, startDate: string, endDate: string) => void;
  getProductMostSelledTable: (id: number, startDate: string, endDate: string, branchId: number) => void;
  getSalesByYearAndMonth: (id: number) => void;
  getSalesByBranchAndMonth: (id: number) => void;
}
