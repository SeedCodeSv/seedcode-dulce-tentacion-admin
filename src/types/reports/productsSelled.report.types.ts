export interface IGetSummaryTotalProductsSelled {
    ok:      boolean;
    summary: Summary[];
    status:  number;
}

export interface Summary {
    branchName: string;
    total:      number;
}


export interface IGetProductsSelled {
    ok:               boolean;
    products_sellled: ProductsSellled[];
    total:            number;
    totalPag:         number;
    currentPag:       number;
    nextPag:          number;
    prevPag:          number;
    status:           number;
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