import { BranchProduct } from './branch_products.types';
import { IPagination } from './global.types';
import { SubCategory } from './sub-category.types';
import { Supplier } from './supplier.types';

export interface Product {
  id: number;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
  tipoDeItem: string;
  tipoItem: string;
  uniMedida: string;
  unidaDeMedida: string;
  subCategoryId: number;
  subCategory: SubCategory;
  productType: string,
  recipeBook?:  RecipeBook ;
}

export interface Verify_Code {
  ok: boolean;
  message: string;
  status: number;
}

export interface IGetProductsPaginated {
  ok: boolean;
  products: Product[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface ProductPayload {
  name: string;
  description: string;
  price?: string;
  costoUnitario?: string;
  code: string;
  subCategoryId: number;
  tipoDeItem: string;
  tipoItem: string;
  uniMedida: string;
  unidaDeMedida: string;
  branch?: { id: number }[];
  supplierId?: number;
}
export interface ProductList {
  ok: boolean;
  message: string;
  products: Product[];
}

export interface ProductPayloadFormik {
  name: string;
  description: string;
  price: string;
  priceA: string;
  priceB: string;
  priceC: string;
  costoUnitario: string;
  code: string;
  subCategoryId: number;
  tipoDeItem: string;
  tipoItem: string;
  uniMedida: string;
  unidaDeMedida: string;
  branch: string[];
  supplierId: number;
}
export interface IProductCart extends IUnidadProducto {
  quantity: number;
  discount: number;
  percentage: number;
  total: number;
  base_price: number;
}
//---------------------------unit_product---------------------------------------
export interface IProducto {
  id: number;
  nombre: string;
  codigo: string;
  tipoItem: number;
  codigoDeBarra: string;
  unidadDeMedida: number;
  precioUnitario: string;
  precio: string;
  cantidad: number;
  nombreUnidadDeMedida: string;
  active: boolean;
}

export interface IUnidad {
  id: number;
  placa: string;
  codigo: string;
  active: boolean;
  userId: number;
}

export interface IUnidadProducto {
  id: number;
  stock: number;
  price: string;
  isActive: boolean;
  producto: IProducto;
  unidade: IUnidad;
  unidadeId: number;
  productoId: number;
}
export interface IGetUnitProduct {
  id: number;
  price: number;
  producto: {
    id: number;
    nombre: string;
    codigo: string;
    tipoItem: number;
    codigoDeBarra: string;
    unidadDeMedida: number;
    precioUnitario: number;
    precio: number;
    cantidad: number;
    nombreUnidadDeMedida: string;
    active: boolean;
  };
  unidadeId: number;
}
export interface IGetUnitProducts {
  ok: boolean;
  status: number;
  productos: IGetUnitProduct[];
}

export interface IGetProductVehicle {
  productos: IUnidadProducto[];
}

export interface IGetProductByCodeVehicle {
  ok: boolean;
  unidadProducto: IUnidadProducto;
  status: number;
}

export interface ProductPayloadForm {
  name: string;
  description: string;
  price?: string;
  priceA: number;
  priceB: number;
  stock: number;
  priceC: number;
  costoUnitario?: string;
  minimumStock: number;
  code: string;
  subCategoryId: number;
  tipoDeItem: string;
  tipoItem: string;
  uniMedida: string;
  unidaDeMedida: string;
  productType: string;
  branch: number[];
  menu: {
    addToMenu: boolean;
    noDeadline: boolean;
    deDate: string;
    alDate: string;
    deTime: string;
    alTime: string;
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  suppliers: [];

}

export interface ProductPayloadFormTwo {
  price?: string;
  priceA: number;
  priceB: number;
  stock: number;
  priceC: number;
  costoUnitario?: string;
  minimumStock: number;
  branch: number[];
  menu: {
    addToMenu: boolean;
    noDeadline: boolean;
    deDate: string;
    alDate: string;
    deTime: string;
    alTime: string;
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  suppliers: [];
}

export interface GetProductRecipeBook {
  recipeBook: Recipe;
  ok: boolean;
  status: number;
}

export interface Recipe {
  id: number;
  isActive: boolean;
  productRecipeBookDetails: ProductRecipeBookDetail[];
  product: Product;
  productId: number;
}

export interface ProductRecipeBookDetail {
  id: number;
  quantity: string;
  productIdReference: number;
  productRecipeBookId: number;
  product: Product;
}
export interface GetProductDetail {
  product: Product;
  ok: boolean;
  status: number;
}

export interface GetBranchProductRecipe extends IPagination {
  data: BranchProductRecipe[];
}

export interface BranchProductRecipe {
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
  branchId: number;
  productId: number;
  // recipeBook: RecipeBook;
}
export interface RecipeBook {
  id: number;
  isActive: boolean;
  productRecipeBookDetails: ProductRecipeBookDetail[];
  productId: number;
  // maxProduction: number;
  cost: string
  performance: number;
}

export interface ProductRecipeBookDetail {
  id: number;
  quantity: string;
  quantityPerPerformance: string;
  // extraUniMedida: string;
  productIdReference: number;
  productRecipeBookId: number;
  // branchProduct: BranchProduct;
}

//products and recipe book

export interface GetProductAndRecipe extends IPagination {
  products: ProductAndRecipe[];
}

export interface ProductAndRecipe {
  id: number;
  name: string;
  description: string;
  tipoItem: string;
  tipoDeItem: string;
  uniMedida: string;
  unidaDeMedida: string;
  code: string;
  isActive: boolean;
  productType: string;
  subCategory: SubCategory;
  recipeBook?: RecipeBookProduct;
  subCategoryId: number;
}

export interface RecipeBookProduct {
  id: number;
  isActive: boolean;
  performance: number;
  cost: string;
  productRecipeBookDetails: ProductRecipeBookDetailList[];
  productId: number;
}

export interface GetProductDetail {
  product: Product,
  ok: boolean,
  status: number
}
export interface ProductRecipeBookDetailList {
  id: number;
  quantity: string;
  productIdReference: number;
  quantityPerPerformance: string;
  product: Product;
  productRecipeBookId: number;
}

export interface PostVerifyRecipePayload {
  branchDestinationId: number;
  branchDepartureId: number;
  productId: number;
  recipeBook: RecipeBook[];
}

export interface VerifyRecipeBook {
  recipeId: number;
}

export interface PostVerifyRecipe {
  ok: boolean;
  data: VerifyRecipe[];
  status: number;
}

export interface VerifyRecipe {
  product: Product;
  branchProduct: BranchProduct;
}

export interface GetBranchProductRecipeSupplier {
  ok: boolean
  data: BranchProductRecipeSupplier[]
  total: number
  totalPag: number
  currentPag: number
  nextPag: number
  prevPag: number
  status: number
}

export interface BranchProductRecipe {
  id: number
  stock: number
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
  recipeBook?: RecipeBook
}


export interface BranchProductRecipeSupplier {
  id: number
  stock: number
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
  recipeBook?: RecipeBook
  suppliers: Supplier[]
  productSuppliers?: ProductSupplier[]
}


export interface ProductSupplier {
  id: number
  isActive: boolean
  supplier: Supplier
  branchProduct: BranchProduct
  branchProductId: number
  supplierId: number
}

export interface RecipeBook {
  id: number
  isActive: boolean
  productRecipeBookDetails: ProductRecipeBookDetail[]
  productId: number
  maxProduction: number
}

export interface ProductRecipeBookDetail {
  id: number
  quantity: string
  extraUniMedida: string
  productIdReference: number
  productRecipeBookId: number
  branchProduct: BranchProduct
}


export interface UpdateBranchProductOrder {
  name: string,
  stock: number,
  price: number,
  priceA: string,
  priceB: string,
  priceC: string,
  minimumStock: number,
  description: string,
  tipoItem: string,
  tipoDeItem: string,
  uniMedida: string,
  unidaDeMedida: string,
  code: string,
  costoUnitario: string,
  subCategoryId: number,
  suppliers: UpdateSuppliersBranchP[],
}


export interface UpdateSuppliersBranchP {
  id: number
  branchProductId: number
  supplierId: number
  name: string
  isActive: boolean
}


