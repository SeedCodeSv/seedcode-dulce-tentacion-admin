export interface Employee {
  id: number;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  code: string;
  phone: string;
  // Other fields omitted for brevity
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  codEstableMH: string;
  codEstable: string;
  tipoEstablecimiento: string;
  transmitterId: number;
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
  productType: string;
  subCategoryId: number;
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
  isActive: boolean;
  product: Product;
  branchId: number;
  productId: number;
}

export interface RecipeDetail {
  id: number;
  quantity: string;
  extraUniMedida: string;
  productIdReference: number;
  productRecipeBookId: number;
  productRecipeBook: {
    id: number;
    isActive: boolean;
    productId: number;
  };
  branchProduct: BranchProduct;
}

export interface Recipe {
  id: number;
  isActive: boolean;
  product: Product;
  productId: number;
  recipeDetails: RecipeDetail[];
}

export interface ProductWithRecipe extends Product {
  recipe?: Recipe;
}

export interface ProductionOrderDetail {
  id: number;
  quantity: number;
  observations: string;
  producedQuantity: number;
  damagedQuantity: number;
  missingQuantity: number;
  damagedReason: string;
  products: Product;
  productionOrderId: number;
  productId: number;
  productRecipe: ProductWithRecipe;
}

export interface ProductionOrderType {
  id: number;
  name: string;
  isActive: boolean;
}

export interface ProductionOrder {
  id: number;
  statusOrder: string;
  observations: string;
  moreInformation: string;
  date: string;
  time: string;
  endDate: string;
  endTime: string;
  producedQuantity: number;
  damagedQuantity: number;
  missingQuantity: number;
  finalNotes: string;
  destinationBranch: Branch;
  receptionBranch: Branch;
  employee: Employee;
  productionOrderType: ProductionOrderType;
  productionOrderTypeId: number;
  employeeOrderId: number;
  receptionBranchId: number;
  destinationBranchId: number;
  details: ProductionOrderDetail[];
}

export interface ProductionOrderResponse {
  ok: boolean;
  productionOrder: ProductionOrder;
  message: string;
  status: number;
}