import {
  IGetSubCategoriesPaginated,
  ISubCategory,
  ISubCategoryPayload,
} from '../../types/sub_categories.types';

export interface SubCategoryStore {
  sub_categories: ISubCategory[];
  sub_categories_paginated: IGetSubCategoriesPaginated;
  loading_sub_categories: boolean;
  getSubCategoriesList: () => void;
  getSubCategoriesPaginated: (page: number, limit: number, name: string, isActive?: number) => void;
  postSubCategory: (payload: ISubCategoryPayload) => void;
  patchSubCategory: (payload: ISubCategoryPayload, id: number) => Promise<boolean>;
  deleteSubCategory: (id: number) => Promise<boolean>;
  activateSubCategory: (id: number) => Promise<boolean>;
  activateSubCategories: (id: number) => Promise<void>;
}
