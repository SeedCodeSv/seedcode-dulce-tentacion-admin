import { create } from 'zustand';
import { ICategoriesStore } from './types/categories_store.types';
import {
  create_category,
  get_categories,
  get_products_categories,
  update_category,
  delete_category,
  activate_category,
} from '../services/categories.service';
import { toast } from 'sonner';
import { messages } from '../utils/constants';

export const useCategoriesStore = create<ICategoriesStore>((set, get) => ({
  paginated_categories: {
    categoryProducts: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  list_categories: [],
  loading_categories: false,
  limit_filter: 5,
  getListCategories() {
    get_categories()
      .then((categories) => set({ list_categories: categories.data.categoryProducts }))
      .catch(() => {
        set({ list_categories: [] });
      });
  },
  getPaginatedCategories: (page: number, limit: number, name: string, active = 1) => {
    set({ loading_categories: true, limit_filter: limit });
    get_products_categories(page, limit, name, active)
      .then((categories) =>
        set({ paginated_categories: categories.data, loading_categories: false })
      )
      .catch(() => {
        set({
          loading_categories: false,
          paginated_categories: {
            categoryProducts: [],
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
  postCategories(name) {
    create_category({ name })
      .then(() => {
        get().getPaginatedCategories(1, get().limit_filter, '');
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  patchCategory(name, id) {
    update_category({ name }, id)
      .then(() => {
        get().getPaginatedCategories(1, get().limit_filter, '');
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.success);
      });
  },
  deleteCategory: async (id) => {
    return await delete_category(id)
      .then(({ data }) => {
        get().getPaginatedCategories(1, get().limit_filter, '');
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);
        return false;
      });
  },
  activateCategory(id) {
    return activate_category(id)
      .then(() => {
        toast.success('Se activo la categoría');
      })
      .catch(() => {
        toast.error('Error al activar la categoría');
      });
  },
}));
