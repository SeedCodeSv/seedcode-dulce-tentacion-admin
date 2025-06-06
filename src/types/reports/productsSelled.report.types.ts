import { IPagination } from "../global.types";

export interface IGetSummaryTotalProductsSelled {
    ok:      boolean;
    summary: Summary[];
    status:  number;
}

export interface Summary {
    branchName: string;
    total:      number;
}


export interface IGetProductsSelled extends IPagination{
    products_sellled: ProductsSellled[];
}

export interface ProductsSellled {
    date:        string;
    branchName:  string;
    code:        string;
    productName: string;
    unitMessure: string;
    quantity:    number;
    price:       number;
    total:       number;
    category:    string;
}


export interface SearchReport {
    branchId: number;
    page: number;
    limit: number;
    startDate?: string;
    endDate?: string;
    productName?: string;
}