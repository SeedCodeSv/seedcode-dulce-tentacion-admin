import { create } from "zustand";

import { get_subcategories } from "../services/sub-category.service";

import { ISubCategoryStore } from "./types/sub_categories_store.types";

export const useSubCategoriesStore = create<ISubCategoryStore>((set) => ({
  subcategories: [],
  subCategoriesPaginated: {
    subCategories: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  getSubcategories(id) {
    get_subcategories(id)
      .then((subcategories) =>
        set({ subcategories: subcategories.data.subCategories })
      )
      .catch(() => {
        set({ subcategories: [] });
      });
  },
}));
