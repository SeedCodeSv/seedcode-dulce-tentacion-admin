import { Transmitter } from '@/types/categories.types';
import { OrderProductDetail } from '@/types/order-products.types';

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
  stock: number;
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
  subCategory?: SubCategoryProduct
}
export interface SubCategoryProduct {
  id: number;
  name: string;
  isActive: boolean;
  categoryProduct: CategoryProduct;
  categoryProductId: number;
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
  branchProducts: BranchProduct[];
  product_selected: BranchProduct[];
  onAddBydetail: (order:OrderProductDetail[] ) => void;
  OnAddProductSelected: (product: BranchProduct) => void;
  OnPlusProductSelected: (productId: number) => void;
  OnMinusProductSelected: (productId: number) => void;
  pagination_shippin_product_branch: IResponseBranchProductPaginatedSent;
  OnClearProductSelected: (productId: number) => void;
  OnClearProductSelectedAll: () => void;
  OnChangeQuantityManual: (productId: number, quantity: number) => void;
  OnUpdatePriceManual: (productId: number, price: string) => void;
  OnUpdateCosteManual: (productId: number, costoUnitario: string) => void;

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
