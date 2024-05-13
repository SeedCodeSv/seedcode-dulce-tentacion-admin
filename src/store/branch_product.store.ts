import { create } from "zustand";
import { IBranchProductStore } from "./types/branch_product.types";
import { get_branch_product } from "../services/branch_product.service";

export const useBranchProductStore = create<IBranchProductStore>(
  (set, get) => ({
    branch_products: [],
    pagination_branch_products: {
      total: 0,
      totalPag: 0,
      currentPag: 0,
      nextPag: 0,
      prevPag: 0,
      status: 200,
      ok: true,
    },
    cart_products: [],
    getPaginatedBranchProducts(branchId, page = 1, limit = 5, name, code) {
      get_branch_product(branchId, page, limit, name, code)
        .then(({ data }) => {
          set({
            branch_products: data.branchProducts,
            pagination_branch_products: {
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
              total: Number(product.price),
              percentage: 0,
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
  })
);
