import { CategoryProduct } from "./categories.types";

export interface SubCategory {
    id: number;
    name: string;
    isActive: boolean;
    categoryProduct: CategoryProduct;
    categoryProductId: number;
  }

  export interface IGetSubCategory {
    ok: boolean;
    status: number;
    subCategories: SubCategory[];
  }