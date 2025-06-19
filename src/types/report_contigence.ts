import { Employee } from './employees.types';
import { IPagination } from './global.types';
import { ISalesStatus } from './sales_status.types';

export interface IResponseContigence {
  ok: boolean;
  sales: Sale[];
  totalPag: number;
  total: number;
  currentPag: number;
  nextPag: number;
  status: number;
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
  selloInvalidation: string;
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
  customerId: number;
  customer: Customer;
  employee: Employee;
  employeeId: number;
  salesStatus: ISalesStatus
  salesStatusId: number;
  tipoItem?: number;
  uniMedida?: number;
  tipoDocumento?: string;
    typeVoucher: string;

}
export interface Direccion {
  id: number;
  departamento: string;
  nombreDepartamento: string;
  municipio: string;
  nombreMunicipio: string;
  complemento: string;
  active: boolean;
}

export interface Customer {
  id: number;
  nombre: string;
  nombreComercial: string;
  nrc: string;
  nit: string;
  tipoDocumento: string;
  numDocumento: string;
  codActividad: string;
  descActividad: string;
  bienTitulo: string;
  telefono: string;
  correo: string;
  isActive: boolean;
  direccion: Direccion;
  esContribuyente: boolean;
  direccionId: number;
  transmitterId: number;
}


export interface OnGetSalesContigence {
  (id: number, page: number, limit: number, startDate: string, endDate: string): void;
}

export interface OnGetSalesNotContigence {
  (id: number, page: number, limit: number, startDate: string, endDate: string): void;
}

export interface OnGetSalesByStatus {
  (
    id: number,
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
    status: number
  ): void;
}

export type ISalesContigenceStore = {
  sales: Sale[];
  saless: Sale[];
  pagination_sales: IPagination;
  pagination_saless: IPagination;
  OnGetSalesContigence: OnGetSalesContigence;
  OnGetSalesNotContigence: OnGetSalesNotContigence;
  OnGetSalesByStatus: OnGetSalesByStatus;
};
export interface ValidateContigence {
  nombre: string;
  nombreComercial: string;
  nrc: string | null;
  nit: string | null;
  nombreDepartamento: string;
  nombreMunicipio: string;
  descActividad: string;
  numDocumento: string;
}
