import { CategoryProductList } from "./categories.types";

export interface SubCategory {
    id: number;
    name: string;
    isActive: boolean;
    categoryProduct: CategoryProductList;
    categoryPorudctId: number;
  }

  export interface IGetSubCategory {
    ok: boolean;
    status: number;
    subCategories: SubCategory[];
  }