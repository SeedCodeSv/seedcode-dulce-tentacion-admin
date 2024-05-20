import { Employee } from "./employees.types";
import { Customer, Direccion } from "./report_contigence";

export interface IGetSales {
  ok: boolean;
  sales: Sale[];
  totalPag: number;
  total: number;
  currentPag: number;
  nextPag: number;
  status: number;
  prevPag: number;
}

interface Sale {
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
  customer: Customer;
  employee: Employee;
  direccion: Direccion;
  employeeId: number;
  paymentTypeId: any;
  selloInvalidation: string;
  salesStatusId: number;
  salesStatus: SaleStatus;
}

interface SaleStatus {
  id: number;
  name: string;
  isActive: boolean;
}
