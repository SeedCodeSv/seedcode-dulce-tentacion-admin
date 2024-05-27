import { Customer } from '../../customers.types';
import { Employee } from '../../users.types';

export interface IResponseExpenseData {
  id: number;
  description: string;
  total: number;
  boxId: number;
  categoryExpenseId: number;
  isActive: boolean;
}
export interface IExpensesData {
  expenses: IResponseExpenseData[];
}
export interface IResponseByBranchSales {
  id: number;
  boxId: number;
  customer: Customer;
  customerId: number;
  employee: Employee;
  employeeId: number;
  paymentType: string;
  salesStatusId: number;
  numeroControl: string;
  codigoGeneracion: string;
  tipoDte: string;
  fecEmi: string;
  horEmi: string;
  selloRecibido: string;
  selloInvalidacion: string;
  sello: boolean;
  codeEmployee: string;
  totalNoSuj: number;
  totalExenta: number;
  totalGravada: number;
  subTotalVentas: number;
  descuNoSuj: number;
  descuExenta: number;
  descuGravada: number;
  porcentajeDescuento: number;
  totalDescu: number;
  subTotal: number;
  totalIva: number;
  montoTotalOperacion: number;
  totalPagar: number;
  totalLetras: string;
  pathPdf: string;
  pathJson: string;
  isActivated: boolean;
}
export interface ISalesByBranchData {
  sales: IResponseByBranchSales[];
}

export interface IReportBranchStore {
  expenses: IResponseExpenseData[];
  sales: IResponseByBranchSales[];
  OnGetReportExpenseByBranch: () => void;
  OnGetReportByBranchSales: () => void;
}
