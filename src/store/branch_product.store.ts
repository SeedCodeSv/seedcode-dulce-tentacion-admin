import { create } from 'zustand';
import { toast } from 'sonner';

import {
  get_branch_product,
  get_branch_product_list,
  get_branch_product_orders,
  get_branches,
  update_branch_product,
} from '../services/branch_product.service';
import { groupBySupplier } from '../utils/filters';

import { IBranchProductStore } from './types/branch_product.types';

import { get_branch_product_recipe, get_branch_product_recipe_supplier } from '@/services/products.service';
import { generateUniqueId } from '@/utils/utils';

export const useBranchProductStore = create<IBranchProductStore>((set, get) => ({
  branch_products: [],
    branchProductsFilteredList: [],
  pagination_branch_products: {
    branchProducts: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 200,
    ok: true,
  },
  branchProductRecipeSupplier: [],
  cart_products: [],
  branch_product_order: [],
  order_branch_products: [],
  orders_by_supplier: [],
  branches_list: [],
  branch_product_order_paginated: {
    branchProducts: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 200,
    ok: true,
  },
  branch_product_order_paginated_loading: false,
  branchProductRecipe: [],
  branchProductRecipePaginated: {
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 200,
    ok: true,
  },
  loadingBranchProductRecipe: false,
  getBranchProductsRecipe(id, page, limit, category, product, code, typeProduct) {
    get_branch_product_recipe(id, page, limit, category, product, code, typeProduct)
      .then(({ data }) => {
        set({
          branchProductRecipe: data.data,
          branchProductRecipePaginated: {
            total: data.total,
            totalPag: data.totalPag,
            currentPag: data.currentPag,
            nextPag: data.nextPag,
            prevPag: data.prevPag,
            status: data.status,
            ok: data.ok,
          },
          loadingBranchProductRecipe: false,
        });
      })
      .catch(() => {
        set({
          branchProductRecipe: [],
          branchProductRecipePaginated: {
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 404,
            ok: false,
          },
          loadingBranchProductRecipe: false,
        });
      });
  },
  getBranchProductRecipeSupplier(id, branchProductId, page, limit, category, product, code, typeProduct) {
    get_branch_product_recipe_supplier(id,branchProductId, page, limit, category, product, code, typeProduct)
      .then(({ data }) => {
        set({
          branchProductRecipeSupplier: data.data,
          branchProductRecipePaginated: {
            total: data.total,
            totalPag: data.totalPag,
            currentPag: data.currentPag,
            nextPag: data.nextPag,
            prevPag: data.prevPag,
            status: data.status,
            ok: data.ok,
          },
          loadingBranchProductRecipe: false,
        });
      })
      .catch(() => {
        set({
          branchProductRecipeSupplier: [],
          branchProductRecipePaginated: {
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 404,
            ok: false,
          },
          loadingBranchProductRecipe: false,
        });
      });
  },
  addProductOrder(product) {
    const products = get().order_branch_products;
    const existProduct = products.find((cp) => cp.id === product.id);

    if (existProduct) {
      toast.warning('El producto ya existe en la orden');
    } else {
      set({
        order_branch_products: [
          ...products,
          {
            ...product,
             numItem: generateUniqueId(),
            quantity: 1,
          },
        ],
      });
      toast.success('Se agrego el producto a la orden', { position: 'top-center' });
    }

    set({ orders_by_supplier: groupBySupplier(get().order_branch_products) });
  },
deleteProductOrder(numItem) {
    const find = get().order_branch_products.find((cp) => cp.numItem === numItem);

    if (find) {
      const products = get().order_branch_products.filter((cp) => cp.numItem !== numItem);

      set({ order_branch_products: products });
    }
    set({ orders_by_supplier: groupBySupplier(get().order_branch_products) });
  },
  updateQuantityOrders(numItem, quantity) {
    set((state) => ({
      order_branch_products: state.order_branch_products.map((cp) =>
        cp.numItem === numItem ? { ...cp, quantity } : cp
      ),
    }));

    set({ orders_by_supplier: groupBySupplier(get().order_branch_products) });
  },
  updatePriceOrders(numItem, price) {
    set((state) => ({
      order_branch_products: state.order_branch_products.map((cp) =>
        cp.numItem === numItem ? { ...cp, price } : cp
      ),
    }));

    set({ orders_by_supplier: groupBySupplier(get().order_branch_products) });
  },
  clearProductOrders() {
    set({ order_branch_products: [] });
    set({ orders_by_supplier: [] });
  },
 removeProductOrder(id) {
    const find = get().order_branch_products.find((cp) => cp.id === id);

    if (find) {
      const products = get().order_branch_products.filter((cp) => cp.id !== id);

      set({ order_branch_products: products });
    }
    set({ orders_by_supplier: groupBySupplier(get().order_branch_products) });
  },
  getPaginatedBranchProducts(branchId, page = 1, limit = 5, name, code) {
    get_branch_product(branchId, page, limit, name, code)
      .then(({ data }) => {
        set({
          branch_products: data.branchProducts,
          pagination_branch_products: {
            branchProducts: [],
            total: data.total,
            totalPag: data.totalPag,
            currentPag: data.currentPag,
            nextPag: data.nextPag,
            prevPag: data.prevPag,
            status: data.status,
            ok: data.ok,
          },
        });
      })
      .catch(() => {
        set({
          branch_products: [],
          pagination_branch_products: {
            branchProducts: [],
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
  getBranchProductOrders(branch, supplier, product, code, page = 1, limit = 5) {
    set({ branch_product_order_paginated_loading: true });
    get_branch_product_orders(branch, supplier, product, code, page, limit)
      .then(({ data }) => {
        set({
          branch_product_order_paginated_loading: false,
          branch_product_order_paginated: {
            branchProducts: data.branchProducts,
            total: data.total,
            totalPag: data.totalPag,
            currentPag: data.currentPag,
            nextPag: data.nextPag,
            prevPag: data.prevPag,
            status: data.status,
            ok: data.ok,
          },
        });
      })
      .catch(() => {
        set({
          branch_product_order_paginated_loading: false,
          branch_product_order: [],
          branch_product_order_paginated: {
            branchProducts: [],
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
  getBranchesList() {
    get_branches()
      .then(({ data }) => {
        set((state) => ({ ...state, branches_list: data.branches }));
      })
      .catch(() => {
        set((state) => ({ ...state, branches_list: [] }));
      });
  },
  patchBranchProduct(id, payload) {
    return update_branch_product(id, payload).then(() => {
      toast.success('Se actualizo con exito')

      return true
    }).catch(() => {
      toast.error('No se proceso la solicitud')

      return false
    })
  },
    async getBranchProductsFilteredList(params) {
    try {
      const res = await get_branch_product_list(params);

      if (!res.ok) return set({ branchProductsFilteredList: [] });

      set({ branchProductsFilteredList: res.branchProducts });
    } catch {
      set({ branchProductsFilteredList: [] });
    }
  },
  onUpdateSupplier(numItem, supplier) {
    set((state) => ({
      order_branch_products: state.order_branch_products.map((cp) =>
        cp.numItem === numItem ? { ...cp, supplier } : cp
      ),
    }));

    set({ orders_by_supplier: groupBySupplier(get().order_branch_products) });
  },
  onDuplicateProduct(product) {
    const products = get().order_branch_products;

    const existProduct = products.find(cp => cp.numItem === product.numItem);

    if (!existProduct) {
      toast.error('El producto no existe y no se puede duplicar');

      return;
    }

    const duplicatedProduct = {
      ...existProduct,
      numItem: generateUniqueId(),
      price: Number(existProduct.price).toFixed(2),
      quantity: 1,
    };

    const updatedProducts = [...products, duplicatedProduct];

    set({ order_branch_products: updatedProducts });

    set({ orders_by_supplier: groupBySupplier(updatedProducts) });
  },
  
}));
