import { PointOfSale } from './point-of-sales.types';
export interface Box {
  id: number;
  start: number;
  end: number;
  totalSales: number;
  totalExpense: number;
  totalIva: number;
  date: string;
  time: string;
  isActive?: boolean;
  pointOfSale: PointOfSale;
  pointOfSaleId: number;
}
export interface IGetBoxList {
  ok: boolean;
  message: string;
  boxes: Box[];
}
export interface IBoxPayload {
  start: number;
  branchId?: number;
}
export interface IGetBox {
  ok: boolean;
  message: string;
  box: Box;
}
export interface ICloseBox {
  state: string;
  fiftyCents: number;
  fiftyDollars: number;
  fiveCents: number;
  fiveDollars: number;
  hundredDollars?: number;
  oneCents: number;
  oneDollar: number;
  oneDollarCents: number;
  tenCents: number;
  tenDollars: number;
  twentyDollars: number;
  twentyFiveCents: number;
  twoDollars: number;
}
export interface DetailBox {
  id: number;
  oneDollar: number;
  twoDollars: number;
  fiveDollars: number;
  tenDollars: number;
  twentyDollars: number;
  fiftyDollars: number;
  hundredDollars: number;
  oneCents: number;
  fiveCents: number;
  tenCents: number;
  twentyFiveCents: number;
  fiftyCents: number;
  oneDollarCents: number;
  box: Box;
  boxId: number;
  isActive?: boolean;
}
export interface IGetBox {
  ok: boolean;
  detailBox: DetailBox;
  totalExpenses: number;
  totalSales: number;
  boxStart: string;
  totalBox: number;
  totalMoney: number;
  cost: number;
  boxEnd: number;
}


//report box
export interface IResponseBox {
  ok: boolean
  boxes: Box_Report[]
  total: number
  totalPag: number
  currentPag: number
  nextPag: number
  prevPag: number
  status: number
}

export interface IResponseExportBox {
  ok: boolean
  boxes: Box_Report[]
  status: number
}


export interface Box_Report {
  id: number
  start: string
  end: string
  totalSales: string
  totalExpense: string
  totalIva: string
  date: string
  time: string
  isActive: boolean
  pointOfSale: PointOfSale_R
  pointOfSaleId: number
  invalidatedTotal: number
  totalSalesStatus: number
}

export interface PointOfSale_R {
  id: number
  code: string
  typeVoucher: string
  description: string
  resolution: string
  serie: string
  from: string
  to: string
  prev: number
  next: number
  codPuntoVentaMH: any
  codPuntoVenta: string
  isActive: boolean
  branch: Branch
  branchId: number
}

export interface Branch {
  id: number
  name: string
  address: string
  phone: string
  isActive: boolean
  codEstableMH: string
  codEstable: string
  tipoEstablecimiento: string
  transmitterId: number
}
