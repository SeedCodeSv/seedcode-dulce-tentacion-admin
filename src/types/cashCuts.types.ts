import { Box } from "./box.types";
import { Employee } from "./employees.types";

export interface ZCashCutsResponse {
    Ticket: {
        inicio: number;
        fin: number;
        total: number;
    };
    Factura: {
        inicio: number;
        fin: number;
        total: number;
    };
    CreditoFiscal: {
        inicio: number;
        fin: number;
        total: number;
    };
    DevolucionNC: {
        inicio: number;
        fin: number;
        total: number;
    };
    DevolucionT: {
        inicio: number;
        fin: number;
        total: number;
    };
    totalGeneral: number;
}
export interface ZCashCutsRequest {
    ok: boolean
    data: ZCashCutsResponse
    status: number
}


export interface IZCashCutsStore {
    data: ZCashCutsResponse
    OnGetCashCutsZ: (startDate?: string, endDate?: string) => void

}

export interface CloseZ {
    posId: number;
    numberCut: number;
    inicioTkt: number;
    finTkt: number;
    typeCut: string
    totalTkt: number;
    inicioF: number;
    finF: number;
    totalF: number;
    inicioCF: number;
    finCF: number;
    totalCF: number
    inicioDevNC: number;
    finDevNC: number
    totalDevNC: number;
    ivaDevTkt: number;
    totalDevTkt: number;
    totalGeneral: number;
}

export interface IGetCutsReport {
    ok: boolean;
    cash_cuts_report: CashCutsReport[];
    total: number;
    totalPag: number;
    currentPag: number;
    nextPag: number;
    prevPag: number;
    status: number;
}

export interface CashCutsReport {
    startDate: string;
    statTime: string;
    endDate: string;
    initialBox?: number;
    endTime: string;
    totalSales: string;
    totalCash: string;
    totalCard: string;
    totalOthers: string;
    expenses: string;
    pettyCash: string;
    cashDelivered: string;
    difference: string;
    branchName: string;
    employee: Employee;
}

export interface IGetCutsReportSummary {
    ok: boolean;
    cash_cuts_summary: CashCutsReportSummary[];
    total: number;
    totalPag: number;
    currentPag: number;
    nextPag: number;
    prevPag: number;
    status: number;
}

export interface CashCutsReportSummary {
    date: string;
    branchName: string
    sumTotalSales: number;
    sumTotalCash: number;
    sumTotalCard: number;
    sumTotalOthers: number;
    sumCashDelivered: number;
    sumExpenses: number;
    writtenTotals?: number[]
}

export interface SearchCutReport {
    branchId?: number;
    page: number;
    limit: number;
    dateFrom?: string;
    dateTo?: string;
    employee?: string;
    branchIds?: number[]
}

export interface IGetDataBox {
    dataBoxes: DataBox[];
    ok: boolean;
    status: number;
    message: string;
}

export interface DataBox {
    box: Box;
    totalSales01Cash?: number;
    totalSales01Card?: number;
    firtsSale: string;
    lastSale: string;
    totalSales03Cash: number | null;
    totalSales03Card: number | null;
    totalsEmployees: { totalSalesAmount: number, totalSaleCount: number }
    firtsSale03: string | null;
    lastSale03: string | null;
    invalidation01: number | null;
    invalidation03: number | null;
    firstInvalidation01: string | null;
    firstInvalidation03: string | null;
    lastInvalidation01: string | null;
    lastInvalidation03: string | null;
    totalNoSuj03: number | null
    totalNoSuj01: number | null
    totalExentos01: number | null
    totalExentos03: number | null
    categories: Categories;
    employees: EmployeeCut[]
}


interface EmployeeCut {
    employeeId: number
    employeeName: string
    saleCount: string
    totalSales: string
}

export interface Categories {
    list: List[];
    totalGeneral?: number;
    totalQuantityGeneral?: number;
}

export interface List {
    category: string;
    quantity: number;
    total: number;
}





