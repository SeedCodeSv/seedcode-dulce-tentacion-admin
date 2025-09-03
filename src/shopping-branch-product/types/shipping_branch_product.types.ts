import { Emisor, Receptor } from './notes_of_remision.types';

import { ICheckStockResponse, ProductQuery } from '@/types/branch_products.types';
import { Transmitter } from '@/types/categories.types';
import { OrderProductDetail } from '@/types/order-products.types';
import { ISubCategory } from '@/types/sub_categories.types';

export interface IResponseBranchProductPaginatedSent {
  ok?: boolean;
  branchProducts?: BranchProduct[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
}
export interface BranchProduct {
  quantity?: number;
  id: number;
  stock: number | string;
  price: string;
  priceA: string;
  priceB: string;
  priceC: string;
  minimumStock: number;
  costoUnitario: string;
  isActive: boolean;
  product: Product;
  branch: Branch;
  branchId: number;
  productId: number;
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
  subCategory?: ISubCategory
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  codEstableMH: string;
  codEstable: string;
  tipoEstablecimiento: string;
  isActive: boolean;
  transmitterId: number;
}
export interface Supplier {
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
  tipoContribuyente: string;
  direccionId: number;
  transmitterId: number;
}

export interface IShippingProductBranchStore {
  orderId: number
  branchProducts: BranchProduct[];
  branchDestiny: Branches;
  product_selected: BranchProduct[];
  response: ICheckStockResponse;
  setResponse: (data: ICheckStockResponse) => void
  onAddBydetail: (order: OrderProductDetail[]) => void;
  OnAddProductSelected: (product: BranchProduct) => void;
  OnPlusProductSelected: (productId: number, stock: number) => void;
  OnMinusProductSelected: (productId: number) => void;
  pagination_shippin_product_branch: IResponseBranchProductPaginatedSent;
  OnClearProductSelected: (productId: number) => void;
  OnClearProductSelectedAll: () => void;
  OnChangeQuantityManual: (branchProductId: number,prdId:number, stock: number, quantity: number ) => void;
  OnUpdatePriceManual: (productId: number, price: string) => void;
  OnUpdateCosteManual: (productId: number, costoUnitario: string) => void;
  onAddBranchDestiny: (branch: Branches) => void
  onAddOrderId: (id: number) => void
  OnClearDataShippingProductBranch: () => void;
  OnGetShippinProductBranch: (
    branchId: number,
    page: number,
    limit: number,
    name: string,
    category: string,
    supplier: string,
    code: string
  ) => void;
  onVerifyStockProducts: (id: number, data: ProductQuery[]) => void
}
export interface FilterShippingProductBranch {
  branchId: number;
  page: number;
  limit: number;
  name: string;
  category: string;
  supplier: string;
  code: string;
}

export interface Branches {
  id: number;
  name: string;
  address: string;
  phone: string;
  codEstable: string;
  codEstableMH: string;
  tipoEstablecimiento: string;
  isActive: boolean;
  transmitter?: Transmitter;
}
export interface CHECK_NUM_EXIST {
  status: string;
  body: BodyNote[] | string;
}
export interface BodyNote {
  codigoGeneracion: string;
  fechaRegistro: string;
  fechaEmision: string;
  tipoDte: string;
  tipoDgii: string;
  nitEmision: string;
  tipoIdenRec: number;
  numeIdenRec: string;
  documento: Documento;
  numeroValidacion: string;
  selloRecibido: string;
  estado: string;
  observaciones: string[];
  firma: string;
}

export interface Identificacion {
  codigoGeneracion: string;
  tipoContingencia: string;
  numeroControl: string;
  tipoOperacion: number;
  ambiente: string;
  fecEmi: string;
  tipoModelo: number;
  tipoDte: string;
  version: number;
  tipoMoneda: string;
  motivoContin: string;
  horEmi: string;
}

export interface Pagos {
  codigo: string;
  periodo: string;
  plazo: string;
  montoPago: number;
  referencia: string;
}

export interface Resumen {
  totalNoSuj: number;
  descuNoSuj: number;
  totalIva: number;
  totalLetras: string;
  ivaRete1: number;
  subTotalVentas: number;
  subTotal: number;
  reteRenta: number;
  tributos: string;
  pagos: Pagos[];
  descuExenta: number;
  totalDescu: number;
  numPagoElectronico: string;
  descuGravada: number;
  porcentajeDescuento: number;
  totalGravada: number;
  montoTotalOperacion: number;
  totalNoGravado: number;
  saldoFavor: number;
  totalExenta: number;
  totalPagar: number;
  condicionOperacion: number;
}

export interface CuerpoDocumento {
  descripcion: string;
  montoDescu: number;
  codigo: string;
  ventaGravada: number;
  ivaItem: number;
  ventaNoSuj: number;
  ventaExenta: number;
  tributos: string;
  numItem: number;
  noGravado: number;
  psv: number;
  tipoItem: number;
  uniMedida: number;
  codTributo: string;
  numeroDocumento: string;
  cantidad: number;
  precioUni: number;
}

export interface Documento {
  extension: string;
  receptor: Receptor;
  identificacion: Identificacion;
  resumen: Resumen;
  cuerpoDocumento: CuerpoDocumento[];
  otrosDocumentos: string;
  ventaTercero: string;
  apendice: string;
  documentoRelacionado: string;
  emisor: Emisor;
}