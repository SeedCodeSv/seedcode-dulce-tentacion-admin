import { create } from 'zustand';
import { toast } from 'sonner';

import { GetConvertProduct, IGetProductsPaginated } from '../types/products.types';
import {
  create_products,
  get_products,
  update_products,
  delete_products,
  activate_product,
  get_promotions_products_list,
  get_product_recipe_book,
  get_product_by_id,
  get_products_and_recipe,
  get_product_list_search,
  convert_product,
  get_converted_product,
  update_product_coversion,
} from '../services/products.service';
import { messages } from '../utils/constants';
import { cat_011_tipo_de_item } from '../services/facturation/cat-011-tipo-de-item.service';

import { IProductsStore } from './types/products.store';

export const useProductsStore = create<IProductsStore>((set, get) => ({
  cat_011_tipo_de_item: [],
  convertedProduct: {} as GetConvertProduct,
  loading_convert: false,
  products_list: [],
  productsFilteredList: [],
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
  productsAndRecipe: [],
  productsAndRecipeLoading: false,
  productsAndRecipePagination: {
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  params: {
    page: 1,
    limit: 30,
    name: "",
    code: "",
    category: 0,
    subCategory: 0,
    active: true
  },
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
  getPaginatedProducts: (params) => {
    set({ loading_products: true });
    get_products(params)
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
  getPaginatedProductsAndRecipe: (
    page,
    limit,
    category,
    subCategory,
    name,
    code,
    active = 1,
    typeProduct
  ) => {
    set({ productsAndRecipeLoading: true });
    get_products_and_recipe(page, limit, category, subCategory, name, code, active, typeProduct)
      .then((products) =>
        set({
          productsAndRecipe: products.data.products,
          productsAndRecipeLoading: false,
          productsAndRecipePagination: products.data,
        })
      )
      .catch(() => {
        set({
          productsAndRecipeLoading: false,
          productsAndRecipePagination: {
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 404,
            ok: false,
          },
          productsAndRecipe: [],
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
    const params = get().params

    return create_products(payload)
      .then(() => {
        get().getPaginatedProducts(params);
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  patchProducts(payload, id): Promise<{ ok: boolean }> {
    const params = get().params

    return update_products(payload, id)
      .then(() => {
        toast.success(messages.success);
        get().getPaginatedProducts(params);

        return { ok: true };
      })
      .catch(() => {
        toast.error(messages.error);

        return { ok: false };
      });
  },
  async deleteProducts(id) {
    const params = get().params

    await delete_products(id)
      .then(() => {
        toast.success(messages.success);
        get().getPaginatedProducts(params);
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

    return get_product_recipe_book(id)
      .then((result) => {
        set({ recipeBook: result.data.recipeBook, loadingRecipeBook: false });

        return true
      })
      .catch(() => {
        set({ recipeBook: null, loadingRecipeBook: false });

        return false
      });
  },
  getConvertProduct(id) {
    set({ loading_convert: true });

    return get_converted_product(id)
      .then(({ data }) => {
        set({ convertedProduct: data.product, loading_convert: false });

        return true
      })
      .catch(() => {
        set({ convertedProduct: null, loading_convert: false });

        return false
      });
  },
  async getProductsFilteredList(params) {
    try {
      const res = await get_product_list_search(params);

      if (!res.ok) return set({ productsFilteredList: [] });

      set({ productsFilteredList: res.products });
    } catch {
      set({ productsFilteredList: [] });
    }
  },
  async onConvertProduct(payload) {
    return convert_product(payload).then(() => {
      return true
    }).catch(() => {
      return false
    })
  },
  async patchConvertProduct(payload, id) {
    const params = get().params

    return update_product_coversion(payload, id)
      .then(() => {
        toast.success(messages.success);
        get().getPaginatedProducts(params);

        return true;
      })
      .catch(() => {
        toast.error(messages.error);

        return false;
      });
  },
}));
