import { create } from 'zustand';
import { toast } from 'sonner';

import {
  get_branch_product,
  get_branch_product_list,
  get_branch_product_orders,
  get_branches,
  get_product_by_code,
  update_branch_product,
} from '../services/branch_product.service';
import { groupBySupplier } from '../utils/filters';

import { IBranchProductStore } from './types/branch_product.types';

import { get_branch_product_recipe, get_branch_product_recipe_supplier } from '@/services/products.service';
import { generate_uuid } from '@/utils/random/random';
import { calc_iva } from '@/utils/money';

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
            quantity: 1,
          },
        ],
      });
      toast.success('Se agrego el producto a la orden', { position: 'top-center' });
    }

    set({ orders_by_supplier: groupBySupplier(get().order_branch_products) });
  },
  deleteProductOrder(id) {
    const find = get().order_branch_products.find((cp) => cp.id === id);

    if (find) {
      const products = get().order_branch_products.filter((cp) => cp.id !== id);

      set({ order_branch_products: products });
    }
    set({ orders_by_supplier: groupBySupplier(get().order_branch_products) });
  },
  updateQuantityOrders(id, quantity) {
    set((state) => ({
      order_branch_products: state.order_branch_products.map((cp) =>
        cp.id === id ? { ...cp, quantity } : cp
      ),
    }));

    set({ orders_by_supplier: groupBySupplier(get().order_branch_products) });
  },
  updatePriceOrders(id, price) {
    set((state) => ({
      order_branch_products: state.order_branch_products.map((cp) =>
        cp.id === id ? { ...cp, price } : cp
      ),
    }));

    set({ orders_by_supplier: groupBySupplier(get().order_branch_products) });
  },
  getProductByCodeOrders(branch, supplier, product, code) {
    get_branch_product_orders(branch, supplier, product, code)
      .then(({ data }) => {
        if (data.branchProducts.length > 0) {
          get().addProductOrder(data.branchProducts[0]);
        }
      })
      .catch(() => {
        set({ branch_product_order: [] });
      });
  },
  clearProductOrders() {
    set({ order_branch_products: [] });
    set({ orders_by_supplier: [] });
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

  getProductByCode(transmitter_id, code) {
    get_product_by_code(transmitter_id, code).then(({ data }) => {
      const { cart_products } = get();
      const existProduct = cart_products.find((cp) => cp.id === data.product.id);

      if (existProduct) {
        get().onPlusQuantity(existProduct.id);
      } else {
        set({
          cart_products: [
            ...cart_products,
            {
              ...data.product,
              quantity: 1,
              base_price: Number(data.product.price),
              discount: 0,
              total: Number(data.product.price),
              porcentaje: 0,
            },
          ],
        });
      }
    });
  },
  addProductCart(product) {
    const { cart_products } = get();
    const existProduct = cart_products.find((cp) => cp.id === product.id);

    if (existProduct) {
      get().onPlusQuantity(existProduct.id);
    } else {
      set({
        cart_products: [
          ...cart_products,
          {
            ...product,
            quantity: 1,
            base_price: Number(product.price),
            discount: 0,
            total: 0,
            porcentaje: 0,
          },
        ],
      });
    }
  },
  deleteProductCart(id) {
    const { cart_products } = get();
    const index = cart_products.findIndex((cp) => cp.id === id);

    if (index > -1) {
      const newCartProducts = [...cart_products];

      newCartProducts.splice(index, 1);
      set({ cart_products: newCartProducts });
    }
  },
  emptyCart() {
    set({ cart_products: [] });
  },
  onPlusQuantity(id) {
    const { cart_products } = get();
    const product = cart_products.find((cp) => cp.id === id);

    if (product) {
      const newCartProducts = cart_products.map((cp) =>
        cp.id === id ? { ...cp, total: cp.total + cp.base_price, quantity: cp.quantity + 1 } : cp
      );

      set({ cart_products: newCartProducts });
    }
  },
  onMinusQuantity(id) {
    const { cart_products } = get();
    const product = cart_products.find((cp) => cp.id === id);

    if (product) {
      if (product.quantity > 1) {
        const newCartProducts = cart_products.map((cp) =>
          cp.id === id ? { ...cp, total: cp.total - cp.base_price, quantity: cp.quantity - 1 } : cp
        );

        set({ cart_products: newCartProducts });
      } else {
        get().onRemoveProduct(id);
      }
    }
  },
  onRemoveProduct(id) {
    set((state) => ({
      cart_products: state.cart_products.filter((cp) => cp.id !== id),
    }));
  },
  onUpdateQuantity(id, quantity) {
    set((state) => ({
      cart_products: state.cart_products.map((cp) =>
        cp.id === id ? { ...cp, total: cp.base_price * quantity, quantity } : cp
      ),
    }));
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
  async onAddProductsByList(id, CuerpoDocumento) {
    set({ cart_products: [] });

    get().onAddProductsByList(id, CuerpoDocumento);
    const promises = CuerpoDocumento.map(async (item) => {
      const { data } = await get_product_by_code(id, item.codigo ?? '');

      return {
        ...data.product,
        uuid: generate_uuid(),
        quantity: item.cantidad,
        price: String(item.precioUni),
        base_price: Number(data.product.price),
        discount: 0,
        total: Number(item.ventaGravada),
        percentage: 0,
        updated_price: Number(data.product.price),
        total_iva: calc_iva(Number(data.product.price)).total_with_iva,
        iva: calc_iva(Number(data.product.price)).iva,
        fixed_price: 0,
        monto_descuento: 0,
        porcentaje_descuento: 0,
        prices: [
          Number(item.precioUni).toFixed(2),
          data.product.price,
          data.product.priceA,
          data.product.priceB,
          data.product.priceC,
        ],
      };
    });
    const products = await Promise.all(promises);

    set({ cart_products: products });
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
}));
