import { create } from "zustand";

import { IReportBranchProductStore } from "./types/report-branch-product.store.types";

import { get_report_branch_product } from "@/services/reports_seller/sales_reports_seller.service";

export const ReportBranchProductStore = create<IReportBranchProductStore>((set) => ({
    data_report: [],
    getReportBranchProduct(name, branch) {
        get_report_branch_product(name, branch).then(({ data }) => {
            set({
                data_report: data.data
            })
        }).catch(() => {
            set({
                data_report: []
            })
        })
    },
}))