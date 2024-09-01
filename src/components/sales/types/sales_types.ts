import { IGetSaleDetails, SaleDetails } from '@/types/sales.types';

export interface IResponseDataSaleInvalidation {
  ok: boolean;
  sales?: Sale[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface Sale {
  id: number;
  numeroControl: string;
  codigoGeneracion: string;
  tipoDte: string;
  typeVoucher: string;
  fecEmi: string;
  horEmi: string;
  selloRecibido: string;
  selloInvalidacion: string;
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
  employee: Employee;
  box: Box;
  customer: Customer;
  boxId: number;
  customerId: number;
  employeeId: number;
  salesStatusId: any;
}

export interface Employee {
  id: number;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  bankAccount: string;
  nit: string;
  dui: string;
  isss: string;
  afp: string;
  code: string;
  phone: string;
  age: number;
  salary: string;
  dateOfBirth: string;
  dateOfEntry: string;
  dateOfExit: any;
  responsibleContact: string;
  isActive: boolean;
  chargeId: number;
  branchId: number;
  employeeStatusId: number;
  studyLevelId: number;
  contractTypeId: number;
  addressId: number;
}

export interface Box {
  id: number;
  start: string;
  end: string;
  totalSales: string;
  totalExpense: string;
  totalIva: string;
  date: string;
  time: string;
  isActive: boolean;
  correlative: Correlative;
  correlativeId: number;
}

export interface Correlative {
  id: number;
  code: string;
  typeVoucher: string;
  resolution: string;
  serie: string;
  from: string;
  to: string;
  prev: number;
  next: number;
  isActive: boolean;
  branchId: number;
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
  esContribuyente: boolean;
  direccion: Direccion;
  branch: Branch;
  direccionId: number;
  branchId: number;
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

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  transmitterId: number;
}

export interface IResponseInvalidation {
  ok: boolean;
  message: string;
  status: number;
}
export interface ISalesInvalidationStore {
  sales?: Sale[];
  sale: SaleDetails;
  OnGetDetails: (id: number) => Promise<IGetSaleDetails>;
  pagination_sales_invalidations: IResponseDataSaleInvalidation;
  OnGetSalesInvalidations: (
    id: number,
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
    typeVoucher: string,
    pointSale: string,
    status: number
  ) => Promise<void>;
  OnInvalidation: (id: number) => Promise<IResponseInvalidation>;
}
