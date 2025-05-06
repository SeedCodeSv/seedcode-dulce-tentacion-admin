import { Branches } from './branches.types';
import { Employee } from './employees.types';
import { Customer, Direccion } from './report_contigence';
import { CF_CuerpoDocumentoItems, SVFC_CF_Firmado } from './svf_dte/cf.types';

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

export interface Sale {
  id: number;
  numeroControl: string;
  codigoGeneracion: string;
  tipoDte: string;
  typeVoucher: string;
  fecEmi: string;
  horEmi: string;
  selloRecibido: string;
  selloInvalidation: string;
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
  customerId: number;
  customer: Customer;
  employee: Employee;
  direccion: Direccion;
  employeeId: number;
  salesStatusId: number;
  salesStatus: SaleStatus;
}

interface SaleStatus {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  tipoItem: string;
  tipoDeItem: string;
  uniMedida: string;
  unidaDeMedida: string;
  code: string;
  isActive: boolean;
  categoryProductId: number;
}

export interface BranchProduct {
  id: number;
  stock: number;
  price: number;
  newPrice: number;
  priceA: number;
  priceB: number;
  priceC: number;
  minimumStock: number;
  costoUnitario: string;
  isActive: boolean;
  product: Product;
  branchId: number;
  productId: number;
  supplierId?: any;
}

export interface Detail {
  id: number;
  montoDescu: number;
  porcentajeDescuento: number;
  newPorcentajeDescu: number;
  ventaNoSuj: number;
  ventaExenta: number;
  ventaGravada: number;
  totalItem: number;
  mewTotal: number;
  newMontoDescu: number;
  newCantidadItem: number;
  newTotalItem: number;
  cantidadItem: number;
  isActive: boolean;
  branchProduct: BranchProduct;
  saleId: number;
  branchProductId: number;
  isEdited: boolean;
}

export interface SaleDetails {
  id: number;
  paymentType: string;
  numeroControl: string;
  codigoGeneracion: string;
  tipoDte: string;
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
  customer: Customer;
  boxId: number;
  customerId: number;
  employeeId: number;
  salesStatusId: number;
  details: Detail[];
}

export interface IGetSaleDetails {
  ok: boolean;
  message: string;
  sale: SaleDetails;
}

export interface ISale_JSON_Debito extends SVFC_CF_Firmado {
  itemsCopy: CF_CuerpoDocumentoItems[];
  indexEdited: number[];
}

export interface SaleEmployee {
  branch: {
    id: number;
    name: string;
    address: string;
    phone: string;
    codEstableMH: string;
    codEstable: string;
    tipoEstablecimiento: string;
    isActive: boolean;
    transmitter: {
      id: number;
      clavePrivada: string;
      clavePublica: string;
      claveApi: string;
      nit: string;
      nrc: string;
      nombre: string;
      telefono: string;
      correo: string;
      descActividad: string;
      codActividad: string;
      nombreComercial: string;
      tipoContribuyente: string;
      active: boolean;
      direccionId: number;
    };
    transmitterId: number;
  };
}

export interface SalesStatu {
  id: number;
  name: string;
  isActive: boolean;
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
  pointOfSaleId: number;
}

export interface SaleDates {
  id: number;
  paymentType: string;
  numeroControl: string;
  codigoGeneracion: string;
  tipoDte: string;
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
  employee: SaleEmployee;
  box: Box;
  customer: Customer;
  salesStatus: SalesStatu;
  boxId: number;
  customerId: number;
  employeeId: number;
  salesStatusId: number;
}

export interface IGetSalesByStatusAndDates {
  ok: boolean;
  sales: SaleDates[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface IGetNotesOfSale {
  ok: boolean;
  message: string;
  notes: { debits: number; credits: number };
}

export interface SaleContingence {
  id: number;
  paymentType: string;
  numeroControl: string;
  codigoGeneracion: string;
  tipoDte: string;
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
  boxId: number;
  customerId: number;
  employeeId: number;
  salesStatusId: number;
}

export interface IGetSalesContingence {
  ok: boolean;
  sales: SaleContingence[];
}

export interface ISaleByItem {
  branch: Branches;
  salesTicket: number;
  salesFe: number;
  salesCfe: number;
  salesTicketCfe: number;
}

export interface IGetSalesByItem {
  ok: boolean;
  data: ISaleByItem[];
  status: number;
}
