import {
  CategoryProduct,
  CategoryProductList,
  IGetCategoriesPaginated,
} from '../../types/categories.types';
export interface ICategoriesStore {
  paginated_categories: IGetCategoriesPaginated;
  list_categories: CategoryProduct[];
  categories_list: CategoryProductList[];
  loading_categories: boolean;
  limit_filter: number;
  getListCategories: () => void;
  getPaginatedCategories: (page: number, limit: number, name: string, active?: number) => void;
  getListCategoriesList: () => void;
  postCategories: (name: string, showSale: boolean) => Promise<{ ok: boolean }>;
  patchCategory: (name: string,showSale:boolean, id: number) => Promise<{ ok: boolean }>;
  deleteCategory: (id: number) => Promise<boolean>;
  activateCategory: (id: number) => Promise<void>;
}
