export interface Sale {
    day: number;
    currentDay: string;
    firstCorrelativ: string;
    lastCorrelative: string;
    firstNumeroControl: string;
    lastNumeroControl: string;
    totalSales: number;
}

export interface SalesByDay {
    type: string;
    typeVoucher: string;
    code: string;
    resolution: string;
    series: string;
    sales: Sale[];
}

export interface IvaSale extends Sale {
    type: string;
    typeVoucher: string;
    code: string;
    resolution: string;
    series: string;
}

export interface IGetAnnexesIva {
    ok: boolean;
    salesByDay: SalesByDay[];
    status: number;
}