import { SaleBranchMonth } from "../../../types/reports/sales.reports.types";

export interface ISalesReportStore {
    sales_branch_month: SaleBranchMonth[],
    getSalesByBranchAndMonth: (id:number) => void 
}