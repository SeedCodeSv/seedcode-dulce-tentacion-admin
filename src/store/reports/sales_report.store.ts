import { create } from "zustand";
import { ISalesReportStore } from "./types/sale_report.store.types";
import { get_sales_by_branch_and_current_month } from "../../services/reports/sales.reports.service";

export const salesReportStore = create<ISalesReportStore>((set) => ({
    sales_branch_month: [],
    getSalesByBranchAndMonth: (id) => {
        get_sales_by_branch_and_current_month(id).then((res) => {
            set({ sales_branch_month: res.data.sales })
        }).catch(() => {
            set({ sales_branch_month: [] })
        })
    },
})) 