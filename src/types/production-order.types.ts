import { BranchProduct } from './branch_products.types';
import { IPagination } from './global.types';

export interface GetProductionOrders extends IPagination {
  productionOrders: ProductionOrder[];
}

export interface ProductionOrder {
  id: number;
  statusOrder: string;
  observations: string;
  moreInformation: string;
  date: string;
  time: string;
  endDate: string | null;
  endTime: string | null;
  destinationBranch: DestinationBranch;
  receptionBranch: ReceptionBranch;
  employee: Employee;
  productionOrderType: ProductionOrderType;
  productionOrderTypeId: number;
  employeeOrderId: number;
  receptionBranchId: number;
  destinationBranchId: number;
}

export interface DestinationBranch {
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

export interface ReceptionBranch {
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

export interface Employee {
  id: number;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  bankAccount: string;
  nit: string;
  dui: string;
  isss: string;
  afp: string;
  code: string;
  phone: string;
  age: number;
  salary: string;
  dateOfBirth: string;
  dateOfEntry: string;
  dateOfExit: string;
  responsibleContact: string;
  isActive: boolean;
  chargeId: number;
  branchId: number;
  employeeStatusId: number;
  studyLevelId: number;
  contractTypeId: number;
  addressId: number;
}

export interface ProductionOrderType {
  id: number;
  name: string;
  isActive: boolean;
}

export interface GetProductionOrder {
  ok: boolean;
  productionOrder: ProductionOrderDetails;
  status: number;
}

export interface ProductionOrderDetails extends ProductionOrder {
  productionOrderDetails: ProductionOrderDetail[];
}

export interface ProductionOrderDetail {
  id: number;
  quantity: number;
  observations: string;
  products: Products;
  productionOrderId: number;
  productId: number;
}

export interface Products {
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

export interface GetVerifyProductionOrder {
  ok: boolean
  productionOrder: ProductionOrderDetailsVerify
  message: string
  status: number
}

export interface ProductionOrderDetailsVerify {
  id: number
  statusOrder: string
  observations: string
  moreInformation: string
  date: string
  time: string
  endDate: string | null
  endTime: string | null
  destinationBranch: DestinationBranch
  receptionBranch: ReceptionBranch
  employee: Employee
  productionOrderType: ProductionOrderType
  productionOrderTypeId: number
  employeeOrderId: number
  receptionBranchId: number
  destinationBranchId: number
  details: Detail[]
}

export interface Detail {
  id: number
  quantity: number
  observations: string
  products: Products
  productionOrderId: number
  productId: number
  productRecipe: ProductRecipe
}

export interface ProductRecipe {
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
  recipe: Recipe
}

export interface Recipe {
  id: number
  isActive: boolean
  product: Products
  productId: number
  recipeDetails: RecipeDetail[]
}

export interface RecipeDetail {
  id: number
  quantity: string
  extraUniMedida: string
  productIdReference: number
  productRecipeBook: ProductRecipeBook
  productRecipeBookId: number
  branchProduct: BranchProduct
}

export interface ProductRecipeBook {
  id: number
  isActive: boolean
  productId: number
}

export interface IngredientStatus {
  sufficient: boolean;
  requiredStock: number;
  availableStock: number;
  usedByOthers: boolean
}

export interface ProductStatus {
  canFulfill: boolean;
  ingredients: Record<number, IngredientStatus>;
}