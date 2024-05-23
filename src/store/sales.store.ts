import { create } from 'zustand';
import { salesStore } from './types/sales.store.types';
import { post_sales } from '../services/sales.service';
import { toast } from 'sonner';
import { messages } from '../utils/constants';
export const useSalesStore = create<salesStore>(() => ({
  postSales: (pdf, dte, cajaId, codigoEmpleado, sello) => {
    post_sales(pdf, dte, cajaId, codigoEmpleado, sello)
      .then(() => {
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
}));
