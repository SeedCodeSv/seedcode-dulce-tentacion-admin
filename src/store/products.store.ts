import { create } from "zustand";
import { IGetProductsPaginated } from "../types/products.types";
import {
  create_products,
  get_products,
  update_products,
  delete_products
} from "../services/products.service";
import { IProductsStore } from "./types/products.store";
import { toast } from "sonner";
import { messages } from '../utils/constants';

export const useProductsStore = create<IProductsStore>((set, get) => ({
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
  savePaginatedProducts: (products: IGetProductsPaginated) =>
    set({ paginated_products: products }),
  getPaginatedProducts: (
    page: number,
    limit: number,
    category: string,
    name: string
  ) => {
    get_products(page, limit, category, name)
      .then((products) => set({ paginated_products: products.data }))
      .catch(() => {
        set({
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
  postProducts(payload) {
    create_products(payload)
      .then(() => {
        get().getPaginatedProducts(1, 5, "", "");
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  patchProducts(payload, id) {
    update_products(payload, id)
      .then(() => {
        get().getPaginatedProducts(1, 5, "", "");
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  async deleteProducts(id) {
    delete_products(id)
      .then(() => {
        toast.success(messages.success)
        get().getPaginatedProducts(1, 5, "", "")
      })
      .catch(() => {
        toast.error(messages.error)
      })
  },
}));
