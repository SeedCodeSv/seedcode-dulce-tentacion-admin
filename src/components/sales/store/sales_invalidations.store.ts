import { create } from 'zustand';
import { IResponseInvalidation, ISalesInvalidationStore } from '../types/sales_types';
import {
  get_sales_invalidation_table,
  invalidation_sale,
} from '../services/sales_invalidations.service';
import { IGetSaleDetails, SaleDetails } from '@/types/sales.types';
import { get_sale_details } from '@/services/sales.service';

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

  sale: {} as SaleDetails,
  OnGetSalesInvalidations: async (
    id: number,
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
    typeVoucher: string,
    pointSale: string,
    status: number
  ) => {
    const response = await get_sales_invalidation_table(
      id,
      page,
      limit,
      startDate,
      endDate,
      typeVoucher,
      pointSale,
      status
    );
    set({ sales: response.data.sales });
    set({ pagination_sales_invalidations: response.data });
  },
  OnGetDetails: async (id: number): Promise<IGetSaleDetails> => {
    const response = await get_sale_details(id);
    set({ sale: response.data.sale });
    return response.data;
  },
  OnInvalidation: async (id: number): Promise<IResponseInvalidation> => {
    const response = await invalidation_sale(id);
    return {
      ok: response.data.ok,
      message: response.data.message,
      status: response.data.status,
    };
  },
}));
