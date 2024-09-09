import { create } from 'zustand';

import {
  get_point_of_sale,
  get_point_of_sales,
  save_point_of_sales,
} from '@/services/point-of-sales.service';
import { toast } from 'sonner';
import { messages } from '@/utils/constants';
import { PointOfSalesStore } from './types/point-of-sales.store.types';

export const usePointOfSales = create<PointOfSalesStore>((set) => ({
  point_of_sales: [],
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

  getPointOfSales(branchId) {
    get_point_of_sales(branchId)
      .then(({ data }) => {
        set({ point_of_sales: data.pointOfSales });
      })
      .catch(() => {
        set({ point_of_sales: [] });
      });
  },

  postPointOfSales(payload) {
    return save_point_of_sales(payload)
      .then((result) => {
        // get().getBranchesPaginated(1, get().limit, '', '', '', get().active);
        // get().getPaginatedPointOfSales(user?.transmitterId ?? 0, 1, 5, '', '', '');

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
