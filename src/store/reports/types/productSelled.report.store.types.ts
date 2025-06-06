import { IGetProductsSelled, IGetSummaryTotalProductsSelled, SearchReport, } from "@/types/reports/productsSelled.report.types";

export interface IProductSelledStore {
    products_selled: IGetProductsSelled;
    summary_products_selled: IGetSummaryTotalProductsSelled;
    loading: boolean;
    loading_summary: boolean;
    getProductsSelled: (params: SearchReport) => void
    getProductSelledSummary: (params: SearchReport) => void
}