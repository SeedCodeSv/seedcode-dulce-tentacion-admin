import { CategoryProduct } from "./categories.types";

export interface ISubCategory {
  id: number;
  name: string;
  isActive: boolean;
  categoryProduct: CategoryProduct;
  categoryProductId: number;
}

export interface IGetListSubCategories { 
  ok: boolean;
  status: number;
  subCategories: ISubCategory[];
}

export interface IGetSubCategoriesPaginated {
  ok: boolean;
  subCategories: ISubCategory[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface ISubCategoryPayload {
  name: string;
  categoryProductId: number;
}