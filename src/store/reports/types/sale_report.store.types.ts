import { SaleBranchMonth, SaleMonthYear, SaleTableDay } from "../../../types/reports/sales.reports.types";

export interface ISalesReportStore {
    sales_branch_month: SaleBranchMonth[],
    sales_month_year: SaleMonthYear[],
    sales_by_day: number,
    sales_table_day:SaleTableDay[],
    getSalesTableDay: (id:number) => void
    getSalesByDay: (id: number) => void
    getSalesByYearAndMonth: (id: number) => void
    getSalesByBranchAndMonth: (id: number) => void
}

