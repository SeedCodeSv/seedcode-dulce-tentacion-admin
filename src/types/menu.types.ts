export interface IResponseMenu {
  ok: boolean
  message: string
  menu: Menu
  MenuDetails: MenuDetail[]
}

export interface Menu {
  id: number
  addToMenu: boolean
  applyDiscount: boolean
  noDeadline: boolean
  deDate: string
  alDate: string
  deTime: string
  alTime: string
  mon: boolean
  tue: boolean
  wed: boolean
  thu: boolean
  fri: boolean
  sat: boolean
  sun: boolean
  isActive: boolean
  branchProduct: BranchProduct
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

export interface MenuDetail {
  id: number
  quantity: string
  uniMedia: string
  isActive: boolean
  branchProduct: BranchProduct2
  menuId: number
  branchProductId: number
}

export interface BranchProduct2 {
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
  branchId: number
  productId: number
  product: ProductMenu

}

export interface ProductMenu {
  id: number
  menuDetailId: number,
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

export interface UpdateMenuDetails {
  menu: MenuUpdate
  receipt: Receipe[];
  products: ProductsMenu[];
}

interface MenuUpdate {
  noDeadline: boolean;
  addToMenu: boolean;
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
  deDate: string;
  alDate: string;
  deTime: string;
  alTime: string;
  isActive: boolean
}

export interface Receipe {
  id: number
  productId: number;
  quantity: number;
  extraUniMedida: string;
  branchProductId: number;
}

export interface ProductsMenu {
  id: number
  productId: number;
  quantity: number;
  uniMedidaExtra: string;
  isActive: boolean
}