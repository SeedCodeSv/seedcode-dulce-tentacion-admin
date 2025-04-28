import { create } from 'zustand';
import { toast } from 'sonner';

import { get_sales_status } from '../services/sales_status.service';

import { ISaleStatusStore } from './types/sale_status.store.types';

export const useSaleStatusStore = create<ISaleStatusStore>((set) => ({
  saleStatus: [],

  OnGetSaleStatusList: async () => {
    await get_sales_status()
      .then((res) => {
        set({ saleStatus: res.data.saleStatus });
      })
      .catch(() => {
        set({ saleStatus: [] });
        toast.error('Error al cargar los estados de venta');
      });
  },
}));
