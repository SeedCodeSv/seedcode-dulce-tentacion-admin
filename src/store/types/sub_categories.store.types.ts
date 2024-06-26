import { IGetSubCategoriesPaginated, ISubCategory, ISubCategoryPayload } from "../../types/sub_categories.types";

export interface ISubCategoriesStore {
  sub_categories: ISubCategory[];
  sub_categories_paginated: IGetSubCategoriesPaginated;
  getSubCategoriesList: () => void;
  getSubCategoriesPaginated: (page: number, limit: number, name: string, active?: number) => void;
  postSubCategory: (payload: ISubCategoryPayload) => void;
  patchSubCategory: (payload: ISubCategoryPayload, id: number) => void;
  deleteSubCategory: (id: number) => Promise<boolean>;
  activateSubCategory: (id: number) => Promise<boolean>;
}