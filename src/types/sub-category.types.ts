import { CategoryProductList } from "./categories.types";

export interface SubCategory {
    id: number;
    name: string;
    isActive: boolean;
    categoryProduct: CategoryProductList;
    categoryProductId: number;
  }

  export interface IGetSubCategory {
    ok: boolean;
    status: number;
    subCategories: SubCategory[];
  }