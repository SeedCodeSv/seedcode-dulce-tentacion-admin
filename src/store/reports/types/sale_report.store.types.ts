import { GraphicSubCategory } from '../../../types/reports/sales.reports.types';
import {
  IDataExpense,
  IDataSalesGrafic,
} from "../../../types/reports/branch_product.reports";
import {
  ISaleCategoryProduct,
  ProductoMostSelledTable,
  SaleBranchMonth,
  SaleMonthYear,
  SaleTable,
} from "../../../types/reports/sales.reports.types";
import {
  IGetSalesByBranchPointSale,
  IGetSalesByPeriod,
  SalesChartGraphPeriod,
} from "../../../types/reports/sales_by_period.report";

export interface ISalesReportStore {
  products_most_selled: ProductoMostSelledTable[];
  sales_branch_month: SaleBranchMonth[];
  sales_month_year: SaleMonthYear[];
  sales_by_day: number;
  expenses: IDataExpense[];
  sales_table_day: SaleTable[];
  data: IDataSalesGrafic[];
  sales_by_period: IGetSalesByPeriod | undefined;
  loading_sales_period: boolean;
  loading_sales_month_year: boolean;
  loading_sales_by_table_date: boolean;
  loading_sales_by_branch_and_month: boolean;
  sales_by_period_graph: SalesChartGraphPeriod | undefined;
  sales_by_point_of_sale_branch: IGetSalesByBranchPointSale | undefined;
  sales_count: number;
  graphic_for_category_products_for_dates: ISaleCategoryProduct[],
  graphic_sub_category_products_for_dates: GraphicSubCategory[],
  getGraphicSubCategoryProductsForDates: (id:number, startDate:string, endDate:string, branch?:string) => void
  getGraphicForCategoryProductsForDates: (startDate:string, endDate:string, branch?:string) => void
  getSalesCount: () => void;
  getSalePointOfSaleByBranch: (
    id: number,
    startDate: string,
    endDate: string
  ) => void;
  getSalesTableDay: (id: number) => void;
  getSalesByPeriod: (
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
    paymentType?: string,
    branch?: string,
    correlative?: string,

  ) => void;
  getSalesByPeriodChart: (startDate: string, endDate: string) => void;
  getSalesByDay: (id: number) => void;
  getSalesExpenseByDate: (
    id: number,
    startDate: string,
    endDate: string
  ) => void;
  getSalesByTransmitter: (
    id: number,
    startDate: string,
    endDate: string
  ) => void;
  getProductMostSelledTable: (
    id: number,
    startDate: string,
    endDate: string,
    branchId: number
  ) => void;
  getSalesByYearAndMonth: (id: number) => void;
  getSalesByBranchAndMonth: (id: number) => void;
}
