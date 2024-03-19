import {
    CategoryProduct,
    IGetCategoriesPaginated,
  } from "../../types/categories.types";
  export interface ICategoriesStore {
    paginated_categories: IGetCategoriesPaginated;
    list_categories: CategoryProduct[];
    getListCategories: () => void;
    getPaginatedCategories: (page: number, limit: number, name: string) => void;
    postCategories: (name: string) => void;
    patchCategory: (name: string, id: number) => void;
  }
  