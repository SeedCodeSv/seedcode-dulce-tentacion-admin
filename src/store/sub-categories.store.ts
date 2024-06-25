import { create } from "zustand";
import { ISubCategoryStore } from "./types/sub_categories_store.types";
import { get_subcategories } from "../services/sub-category.service";

export const useSubCategoriesStore = create<ISubCategoryStore>((set) => ({
    subcategories: [],
    getSubcategories(id) {
        get_subcategories(id)
            .then((subcategories) => set({ subcategories: subcategories.data.subCategories }))
            .catch(() => {
                set({ subcategories: [] });
            });
    },
}))