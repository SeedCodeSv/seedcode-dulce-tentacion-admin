import { BranchProduct, Product } from "./branch_products.types";
import { Branches } from "./branches.types";

export interface IGetBranchProductOrderPaginated {
  ok: boolean;
  branchProducts: IBranchProductOrder[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface BranchProductOrder {
  id: number
  stock: number
  price: string
  priceA: string
  priceB: string
  priceC: string
  minimumStock: number
  costoUnitario: string
  product: Product
  branch: Branches
  branchId: number
  productId: number
  supplierId: number
}

export interface BranchProductUpdate {
  name: string
  description: string
  price: string
  classId: number
  code: string
  costoUnitario: string
  minimumStock: number
  priceA: string
  priceB: string
  priceC: string
  stock: number
  supplierId: number
  tipoDeItem: string
  tipoItem: string
  uniMedida: string
  unidaDeMedida: string
}

export interface IGetBranchProductPaginated {
  ok: boolean
  branchProducts: BranchProduct[]
  total: number
  totalPag: number
  currentPag: number
  nextPag: number
  prevPag: number
  status: number
}
export interface IGetBranchProductByCode {
  ok: boolean
  message: string
  product: BranchProduct
}
export interface Supplier {
  id: number
  nombre: string
  nombreComercial: string
  nrc: string
  nit: string
  tipoDocumento: string
  numDocumento: string
  codActividad: string
  descActividad: string
  bienTitulo: string
  telefono: string
  correo: string
  isActive: boolean
  esContribuyente: boolean
  direccionId: number
  transmitterId: number
}

export interface IBranchProductOrder {
  id: number
  stock: number
    price: number | string;
  priceA: string
  priceB: string
  priceC: string
  minimumStock: number
  costoUnitario: string
  isActive: boolean
  product: Product
  branch: Branches
  branchId: number
  productId: number
  suppliers: Supplier[]
    supplier?: Supplier;
  supplierId: number
}

export interface IBranchProductOrderQuantity extends IBranchProductOrder {
    numItem: string
  quantity: number
}

export interface IGetBranchProductOrder {
  ok: boolean
  message: string
  branchProducts: IBranchProductOrder[]
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface SupplierProducts {
  supplier: Supplier
  products: IBranchProductOrderQuantity[]
}
