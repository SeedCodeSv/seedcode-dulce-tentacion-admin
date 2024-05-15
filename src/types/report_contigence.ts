import { IPagination } from './global.types';

export interface IResponseContigence {
  ok: boolean;
  sales: Sale[];
  totalPag: number;
  total: number;
  currentPag: number;
  nextPag: number;
  status : number
  prevPag: number;
}
export interface IResponseNotContigence {
  ok: boolean;
  saless: Sale[];
  totalPag: number;
  total: number;
  currentPag: number;
  nextPag: number;
  status: number;
  prevPag: number;
}
export interface Sale {
  id: number;
  numeroControl: string;
  codigoGeneracion: string;
  tipoDte: string;
  fecEmi: string;
  horEmi: string;
  selloRecibido: string;
  sello: boolean;
  codeEmployee: string;
  totalNoSuj: string;
  totalExenta: string;
  totalGravada: string;
  subTotalVentas: string;
  descuNoSuj: string;
  descuExenta: string;
  descuGravada: string;
  porcentajeDescuento: string;
  totalDescu: string;
  subTotal: string;
  totalIva: string;
  montoTotalOperacion: string;
  totalPagar: string;
  totalLetras: string;
  pathPdf: string;
  pathJson: string;
  isActivated: boolean;
  boxId: number;
  customerId: any;
  employeeId: number;
  paymentTypeId: any;
}

export interface ISalesContigenceStore {
  sales: Sale[];
  saless: Sale[];
  pagination_sales: IPagination;
  pagination_saless: IPagination;
  OnGetSalesContigence: (id: number, page: number, limit: number , startDate: string, endDate: string) => void;
  OnGetSalesNotContigence: (id: number, page: number, limit: number, startDate: string, endDate: string) => void;
}
