import { create } from 'zustand';
import { toast } from 'sonner';

import { PointOfSalesStore } from './types/point-of-sales.store.types';

import {
  get_point_of_sale,
  get_point_of_sale_list,
  get_point_of_sales,
  patch_point_of_sale,
  save_point_of_sales,
} from '@/services/point-of-sales.service';
import { messages } from '@/utils/constants';
import { BranchPointOfSale } from '@/types/point-of-sales.types';

export const usePointOfSales = create<PointOfSalesStore>((set) => ({
  point_of_sales: [],
  loading_point_of_sales: false,
  loading_point_of_sales_list: false,
  paginated_point_of_sales: {
    correlatives: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  point_of_sales_list: {} as BranchPointOfSale,

  getPointOfSales(branchId) {
    get_point_of_sales(branchId)
      .then(({ data }) => {
        set({ point_of_sales: data.pointOfSales });
      })
      .catch(() => {
        set({ point_of_sales: [] });
      });
  },
  //Metodo listado de puntos de venta
  getPointOfSalesList(branchId) {
    set({ loading_point_of_sales_list: true });

    return get_point_of_sale_list(branchId)
      .then(({ data }) => {
        set((state) => ({
          ...state,
          point_of_sales_list: data.branch,
          loading_point_of_sales_list: false,
        }));
      })
      .catch(() => {
        set((state) => ({
          ...state,
          point_of_sales_list: {} as BranchPointOfSale,
          loading_point_of_sales_list: false,
        }));
      });
  },

  patchPointOfSales(payload, id) {
    return patch_point_of_sale(payload, id)
      .then(({ data }) => {
        toast.success(messages.success);

        return data.ok;
      })
      .catch(() => {
        toast.error(messages.error);

        return false;
      });
  },

  postPointOfSales(payload) {
    return save_point_of_sales(payload)
      .then((result) => {
        toast.success(messages.success);

        return result.data.ok;
      })
      .catch(() => {
        toast.error(messages.error);

        return false;
      });
  },

  getPaginatedPointOfSales: (Transmitter, page, limit, posCode, branch, dteType) => {
    set({ loading_point_of_sales: true });
    get_point_of_sale(Transmitter, page, limit, posCode, branch, dteType)
      .then((products) =>
        set({ paginated_point_of_sales: products.data, loading_point_of_sales: false })
      )
      .catch(() => {
        set({
          loading_point_of_sales: false,
          paginated_point_of_sales: {
            correlatives: [],
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
}));
