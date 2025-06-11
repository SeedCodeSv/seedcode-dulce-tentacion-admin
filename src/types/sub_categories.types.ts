import { Employee } from './employees.types'

export interface ISubCategory {
  id: number
  name: string
  isActive: boolean
  categoryProduct: CategoryProduct
  categoryProductId: number
}

export interface IGetListSubCategories {
  ok: boolean;
  status: number;
  subCategories: ISubCategory[];
}

export interface IGetSubCategoriesPaginated {
  ok: boolean;
  SubCategories: ISubCategory[];
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

export interface CategoryProduct {
  id: number
  name: string
  isActive?: boolean
}
export interface PropsUpdateEmployee {
  data?: Employee | undefined;

  id: (id: number) => void;
}