import { create } from 'zustand';
import { SubCategoryStore } from './types/sub_category_store';
import { toast } from 'sonner';
import { messages } from '../utils/constants';
import { activate_sub_category, create_sub_category, delete_sub_category, get_sub_categories_list, get_sub_categories_paginated, update_sub_category } from '../services/sub_categories.service';
import { ISubCategoryPayload } from '../types/sub_categories.types';

export const useSubCategoryStore = create<SubCategoryStore>((set, get) => ({
  sub_categories_paginated: {
    SubCategories: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  loading_sub_categories: false,
  sub_categories: [],
  getSubCategoriesList() {
    get_sub_categories_list()
      .then(({ data }) => set({ sub_categories: data.subCategories }))
      .catch(() => {
        set({ sub_categories: [] });
      });
  },

  getSubCategoriesPaginated: (page: number, limit: number, name: string) => {
  set({ loading_sub_categories: true });
    get_sub_categories_paginated(page, limit, name)
      .then(({ data }) =>
        set({
          sub_categories_paginated: data, loading_sub_categories: false,
        })
      )
      .catch(() => {
        set({
          loading_sub_categories: false,
          sub_categories_paginated: {
            SubCategories: [],
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 404,
            ok: false,
          },
        });
      });
  },
  postSubCategory(payload: ISubCategoryPayload) {
    create_sub_category(payload)
      .then(() => {
        get().getSubCategoriesPaginated(1, 5, '');
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  patchSubCategory(payload, id) {
    return update_sub_category(payload, id)
      .then(({ data }) => {
        get().getSubCategoriesPaginated(1, 5, '');
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.error(messages.error);
        return false;
      });
  },
  deleteSubCategory: (id) => {
    return delete_sub_category(id).then((res) => {
      get().getSubCategoriesPaginated(1, 5, '');
      toast.success(messages.success);
      return res.data.ok;
    }).catch(() => {
      toast.error(messages.error);
      return false;
    });
  },
  async activateSubCategory(id) {
    try {
      const res = await activate_sub_category(id);
      get().getSubCategoriesPaginated(1, 5, '');
      toast.success(messages.success);
      return res.data.ok;
    } catch {
      toast.error(messages.error);
      return false;
    }
  }
}));