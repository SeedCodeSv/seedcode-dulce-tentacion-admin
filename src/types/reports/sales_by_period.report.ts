export interface Sale {
  date: string;
  totalSales: string;
  ivaRetenido1: string;
  salesCount: string;
  totalPagar: string;
}

export interface IGetSalesByPeriod {
  ok: boolean;
  sales: Sale[];
  total: number;
  totalPag: number;
  totalSales: number;
  countSales: number;
  totalPagar: number;
  ivaRetenido: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface SalesGraph {
  branch: string;
  quantity: number;
  total: number;
  id: number;
}

export interface SalesChartGraphPeriod {
  ok: boolean;
  message: string;
  startDate: string;
  endDate: string;
  data: SalesGraph[];
}

export interface SalesMap {
  code: string;
  quantity: number;
  total: number;
}

export interface IGetSalesByBranchPointSale {
  ok: boolean;
  totalSales: number;
  salesMap: SalesMap[];
  status: number;
}
