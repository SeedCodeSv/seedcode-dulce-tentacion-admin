export enum TypeOfProduct {
  Standard = 'Estandar',
  Service = 'Servicio',
  Combo = 'Combo',
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  transmitterId: number;
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
  branch: Branch;
  branchId: number;
  productId: number;
  suppliers: Supplier[]
  supplierId: number;
  fixedPrice: string;
  maximum: number;
  porcentaje: number;
  minimum: number;
  days: string;
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

export interface ICartProduct extends BranchProduct {
  quantity: number;
  discount: number;
  porcentaje: number;
  total: number;
  base_price: number;
}

export interface IGetBranchProductByCode {
  ok: boolean;
  message: string;
  product: BranchProduct;
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
  subCategory: SubCategory;
  subCategoryId: number;
}
export interface SubCategory {
  id: number;
  name: string;
  isActive: boolean;
  categoryProduct: CategoryProduct;
  categoryPorudctId: number;
}

export interface CategoryProduct {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
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
  direccionId: number;
  transmitterId: number;
}

export interface IBranchProductOrder {
  id: number;
  stock: number;
  price: number;
  priceA: string;
  priceB: string;
  priceC: string;
  minimumStock: number;
  costoUnitario: string;
  isActive: boolean;
  product: Product;
  branch: Branch;
  supplier: Supplier;
  branchId: number;
  productId: number;
  supplierId: number;
}

export interface IBranchProductOrderQuantity extends IBranchProductOrder {
  quantity: number;
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

export interface SupplierProducts {
  supplier: Supplier;
  products: IBranchProductOrderQuantity[];
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

