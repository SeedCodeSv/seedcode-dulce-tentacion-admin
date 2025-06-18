import { Branches } from "./branches.types";
import { Product } from "./products.types";

export enum TypeOfProduct {
  Standard = 'Estandar',
  Service = 'Servicio',
  Combo = 'Combo',
}

export interface BranchProduct {
  id: number;
  stock: number;
  price: string;
  priceA: string;
  priceB: string;
  priceC: string;
  minimumStock: number;
  costoUnitario: string;
  product: Product;
  branch: Branches;
  branchId: number;
  productId: number;
  suppliers: Supplier[]
  fixedPrice: string;
  maximum: number;
  porcentaje: number;
  minimum: number;
  days: string;
  isActive: boolean
}

export interface BProductPlusQuantity extends BranchProduct {
  quantity?: string
  completedRequest?: boolean
  finalQuantitySend?: string
}

export interface IGetBranchProductPaginated {
  ok: boolean;
  branchProducts: BranchProduct[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface CategoryProduct {
  id: number;
  name: string;
  isActive: boolean;
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
  direccionId: number;
  transmitterId: number;
}

export interface IBranchProductOrder {
  id: number;
  stock: number;
  price: number | string;
  priceA: string;
  priceB: string;
  priceC: string;
  minimumStock: number;
  costoUnitario: string;
  isActive: boolean;
  product: Product;
  branch: Branches;
  supplier?: Supplier;
  suppliers: Supplier[]
  branchId: number;
  productId: number;
  supplierId: number;
}
export interface IGetBranchProductOrder {
  ok: boolean;
  message: string;
  branchProducts: IBranchProductOrder[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}
export interface IPayloadBranchProduct {
  productId: number;
  branchId: number;
  stock: number;
  price: number;
  priceA: number;
  priceB: number;
  priceC: number;
  costoUnitario: number;
  minimumStock: number;
}

export interface ICheckStockResponse {
  ok: boolean;
  results: Result[];
}

export interface Result {
  productId: number;
  productName: string;
  status: string;
  stock?: string;
  required?: number;
  message: string;
}

