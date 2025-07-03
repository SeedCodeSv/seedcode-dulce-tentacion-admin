import { Branches } from './branches.types';
import { Customer } from './customers.types';
import { NRE_CuerpoDocumento, SVFC_NRE_Firmado } from './svf_dte/nre.types';

export interface Employee {
  id: number;
  fullName: string;
  firstName?: string;
  secondName?: string;
  firstLastName?: string
  secondLastName?: string
  dui?: string
  nit?: string
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
  branch: Branches;
  status: Status;
  branchId: number;
  customerId?: any;
  employeeId: number;
  statusId: number;
  isCompleted?: boolean
  receivingEmployeeId?: number
  receivingBranchId?: number,
  receivingBranch: Branches

}

export interface Notifications_Referal {
  others:Others[],
  referalNote:ReferalNote[]
}
export interface Others {
  descripcion: string;
  time?: number
}
export interface IExportNote extends ReferalNote {
  receivingBranchName?: string
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

export interface IGetNoteReferalContingence {
  ok: boolean
  contingence_referal: ReferalNote[]
}
export interface IExportExcel {
  ok: boolean;
  referalNotes: IExportNote[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface IResponseNote {
  ok: boolean
  total: number
  totalPag: number
  currentPag: number
  nextPag: number
  prevPag: number
  status: number
  NoteRerefal: ReferalNote[]
}

export interface IReferal_JSON_Note extends SVFC_NRE_Firmado {
  itemsCopy: NRE_CuerpoDocumento[]
  indexEdited: number[]
}
export interface IGetRecenReferal {
  ok: boolean
  status: number
  referalNotes: ReferalNote[]
}

export interface InvalidateNoteRemision {
  nameResponsible: string
  nameApplicant: string
  docNumberResponsible: string
  docNumberApplicant: string
  typeDocResponsible: string
  typeDocApplicant: string
}

export interface PayloadReferel {
  code: string
  descriptionCompleted: string
}

//===================================
export interface IResponseNoteInvali {
  ok: boolean
  noteReferalInvalidate: NoteReferalInvalidate[]
  total: number
  totalPag: number
  currentPag: number
  nextPag: number
  prevPag: number
  status: number
}

export interface NoteReferalInvalidate {
  id: number
  numeroControl: string
  codigoGeneracion: string
  tipoDte: string
  fecEmi: string
  horEmi: string
  selloRecibido: string
  selloInvalidacion: string
  sello: boolean
  totalNoSuj: string
  totalExenta: string
  totalGravada: string
  subTotalVentas: string
  descuNoSuj: string
  descuExenta: string
  descuGravada: string
  porcentajeDescuento: string
  totalDescu: string
  tributos: string
  subTotal: string
  montoTotalOperacion: string
  totalPagar: string
  totalLetras: string
  EmployeeRequestCancelled: string
  observaciones: string
  nombreRecibe: string
  docRecibe: string
  descriptionCompleted: string
  pathJson: string
  isCompleted: boolean
  isActive: boolean
  branchId: number
  receivingBranchId: number
  customerId: any
  employeeId: number
  receivingEmployeeId: number
  statusId: number
}
// ==========================================
export interface IResponseDetailNote {
  ok: boolean
  detailNote: DetailNote[]
  status: number
}

export interface DetailNote {
  id: number
  montoDescu: string
  ventaNoSuj: string
  ventaExenta: string
  ventaGravada: string
  totalItem: string
  cantidadItem: number
  isActive: boolean
  branchProduct: BranchProduct
  referalNoteId: number
  branchProductId: number
}


export interface BranchProduct {
  id: number
  stock: string
  retainedProducts: number
  price: string
  priceA: string
  priceB: string
  priceC: string
  minimumStock: number
  costoUnitario: string
  isActive: boolean
  product: Product
  branchId: number
  productId: number
}

export interface Product {
  id: number
  name: string
  description: string
  tipoItem: string
  tipoDeItem: string
  uniMedida: string
  unidaDeMedida: string
  code: string
  isActive: boolean
  productType: string
  subCategoryId: number
}
