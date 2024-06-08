import { create } from 'zustand';
import { salesStore } from './types/sales.store.types';
import { get_sale_details, post_sales } from '../services/sales.service';
import { toast } from 'sonner';
import { messages } from '../utils/constants';
export const useSalesStore = create<salesStore>((set) => ({
  sale_details: undefined,
  postSales: (pdf, dte, cajaId, codigoEmpleado, sello) => {
    post_sales(pdf, dte, cajaId, codigoEmpleado, sello)
      .then(() => {
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  getSaleDetails(id) {
    get_sale_details(id).then(({ data }) => {
      set({ sale_details: data.sale })
    }).catch(() => {
      set({ sale_details: undefined })
    })
  },
}));
