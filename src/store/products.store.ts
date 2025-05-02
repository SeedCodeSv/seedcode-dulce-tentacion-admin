import { create } from 'zustand';
import { toast } from 'sonner';

import { IGetProductsPaginated } from '../types/products.types';
import {
  create_products,
  get_products,
  update_products,
  delete_products,
  activate_product,
  get_promotions_products_list,
  get_product_recipe_book,
  get_product_by_id,
} from '../services/products.service';
import { messages } from '../utils/constants';
import { cat_011_tipo_de_item } from '../services/facturation/cat-011-tipo-de-item.service';

import { IProductsStore } from './types/products.store';

export const useProductsStore = create<IProductsStore>((set, get) => ({
  cat_011_tipo_de_item: [],
  products_list: [],
  paginated_products: {
    products: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  loading_products: false,
  recipeBook: null,
  productsDetails: null,
  loadingProductsDetails: false,
  loadingRecipeBook: false,
  getProductsDetails(id) {
    get_product_by_id(id)
      .then(({ data }) => {
        set((state) => ({
          ...state,
          productsDetails: data.product,
          loadingProductsDetails: false,
        }));
      })
      .catch(() => {
        set((state) => ({
          ...state,
          productsDetails: null,
          loadingProductsDetails: false,
        }));
      });
  },
  savePaginatedProducts: (products: IGetProductsPaginated) => set({ paginated_products: products }),
  getPaginatedProducts: (page, limit, category, subCategory, name, code, active = 1) => {
    set({ loading_products: true });
    get_products(page, limit, category, subCategory, name, code, active)
      .then((products) => set({ paginated_products: products.data, loading_products: false }))
      .catch(() => {
        set({
          loading_products: false,
          paginated_products: {
            products: [],
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
  getListProductsList() {
    get_promotions_products_list()
      .then((products) => set({ products_list: products.data.products }))
      .catch(() => {
        set({ products_list: [] });
      });
  },
  getCat011TipoDeItem() {
    cat_011_tipo_de_item()
      .then(({ data }) => {
        set((state) => ({
          ...state,
          cat_011_tipo_de_item: data.object,
        }));
      })
      .catch(() => {
        set((state) => ({
          ...state,
          cat_011_tipo_de_item: [],
        }));
      });
  },
  postProducts(payload) {
    return create_products(payload)
      .then(() => {
        get().getPaginatedProducts(1, 5, '', '', '', '');
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  patchProducts(payload, id): Promise<{ ok: boolean }> {
    return update_products(payload, id)
      .then(() => {
        get().getPaginatedProducts(1, 5, '', '', '', '');
        toast.success(messages.success);

        return { ok: true };
      })
      .catch(() => {
        toast.error(messages.error);

        return { ok: false };
      });
  },
  async deleteProducts(id) {
    await delete_products(id)
      .then(() => {
        toast.success(messages.success);
        get().getPaginatedProducts(1, 5, '', '', '', '');
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  async activateProduct(id) {
    return await activate_product(id)
      .then(() => {
        toast.success('Se activo el producto');
      })
      .catch(() => {
        toast.error('Error al actualizar');
      });
  },
  getRecipeBook(id) {
    set({ loadingRecipeBook: true });
    get_product_recipe_book(id)
      .then((result) => {
        set({ recipeBook: result.data.recipeBook, loadingRecipeBook: false });
      })
      .catch(() => {
        set({ recipeBook: null, loadingRecipeBook: false });
      });
  },
}));
