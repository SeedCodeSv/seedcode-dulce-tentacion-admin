import { IPagination } from "../global.types";

export interface IGetSummaryTotalProductsSelled {
    ok: boolean;
    summary: Summary[];
    totals: Totals;
    status: number;
}

export interface Summary {
    date: string;
    totalGeneral: number;
    [branchName: string]: number | string;
}

export interface IGetProductsSelled extends IPagination {
    products_sellled: ProductsSellled[];
}

export interface ProductsSellled {
    date: string;
    branchName: string;
    code: string;
    productName: string;
    unitMessure: string;
    quantity: number;
    price: number;
    total: number;
    category: string;
}


export interface SearchReport {
    page: number;
    limit: number;
    startDate: string;
    endDate: string;
    branchId?: number;
    branchIds?: number[];
    productName?: string;
    name?: string
}
interface Totals {
    [branchName: string]: number;
}

export interface IGetTotalProductsSelledByBranches {
    ok: boolean;
    data: BranchTotals[];
    branchTotals: Totals;
    status: number;
}

export interface BranchTotals {
    productName: string;
    [branchName: string]: number | string;
}



