import { ReportBranchProduct } from "@/types/reports_seller/sales_reports_seller.types";

export interface IReportBranchProductStore {
    data_report: ReportBranchProduct[]
    getReportBranchProduct:(name:string, branch:string)=>void
}