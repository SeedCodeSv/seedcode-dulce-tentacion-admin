import { IGetProductsSelled, IGetSummaryTotalProductsSelled, IGetTotalProductsSelledByBranches, SearchReport, } from "@/types/reports/productsSelled.report.types";

export interface IProductSelledStore {
    products_selled: IGetProductsSelled;
    summary_products_selled: IGetSummaryTotalProductsSelled;
    products_selled_by_branches: IGetTotalProductsSelledByBranches
    loading: boolean;
    loading_data: boolean;
    loading_summary: boolean;
    getProductsSelled: (params: SearchReport) => void
    getProductSelledSummary: (params: SearchReport) => void
     getProductSaledByBranches: (params: SearchReport) => void
}