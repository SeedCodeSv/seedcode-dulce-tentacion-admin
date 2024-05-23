import { CategoryProduct, IGetCategoriesPaginated } from '../../types/categories.types';
export interface ICategoriesStore {
  paginated_categories: IGetCategoriesPaginated;
  list_categories: CategoryProduct[];
  loading_categories: boolean;
  getListCategories: () => void;
  getPaginatedCategories: (page: number, limit: number, name: string, active?: number) => void;
  postCategories: (name: string) => void;
  patchCategory: (name: string, id: number) => void;
  deleteCategory: (id: number) => Promise<boolean>;
  activateCategory: (id: number) => Promise<void>;
}
