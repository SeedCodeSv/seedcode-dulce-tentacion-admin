import { create } from 'zustand';
import { ISalesInvalidationStore } from '../types/sales_types';
import { get_sales_invalidation_table } from '../services/sales_invalidations.service';

export const useSalesInvalidation = create<ISalesInvalidationStore>((set) => ({
  sales: [],
  pagination_sales_invalidations: {
    ok: false,
    sales: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 0,
  },
  OnGetSalesInvalidations: async (
    id: number,
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
    typeVoucher: string,
    pointSale: string
  ) => {
    const response = await get_sales_invalidation_table(
      id,
      page,
      limit,
      startDate,
      endDate,
      typeVoucher,
      pointSale
    );
    set({ sales: response.data.sales });
    set({ pagination_sales_invalidations: response.data });
  },
}));
