import { Branch } from './branch_products.types';
import { Customer } from './customers.types';

export interface Employee {
  id: number;
  fullName: string;
  firstName?: string;
  secondName?: string;
  phone: string;
  typeDocument: string;
  numDocument: string;
  isActive: boolean;
  branchId: number;
}

export interface Status {
  id: number;
  name: string;
  isActive: boolean;
}

export interface ReferalNote {
  id: number;
  numeroControl: string;
  codigoGeneracion: string;
  tipoDte: string;
  fecEmi: string;
  horEmi: string;
  selloRecibido: string;
  selloInvalidacion: string;
  sello: boolean;
  totalNoSuj: string;
  totalExenta: string;
  totalGravada: string;
  subTotalVentas: string;
  descuNoSuj: string;
  descuExenta: string;
  descuGravada: string;
  porcentajeDescuento: string;
  totalDescu: string;
  tributos: string;
  subTotal: string;
  montoTotalOperacion: string;
  totalPagar: string;
  totalLetras: string;
  observaciones: string;
  nombreRecibe: string;
  docRecibe: string;
  pathJson: string;
  isActive: boolean;
  customer?: Customer;
  employee: Employee;
  branch: Branch;
  status: Status;
  branchId: number;
  customerId?: any;
  employeeId: number;
  statusId: number;
}

export interface IGetReferalNotes {
  ok: boolean;
  referalNotes: ReferalNote[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}
