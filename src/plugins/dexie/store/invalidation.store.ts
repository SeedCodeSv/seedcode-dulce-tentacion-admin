import { create } from 'zustand';
import { IInvalidationStore } from './types/invalidation_store.types';
import {
  firmarDocumentoInvalidacion,
  send_to_mh_invalidation,
} from '../../../services/DTE.service';
import { ISignInvalidationData } from '../../../types/DTE/invalidation.types';
import { ambiente } from '../../../utils/constants';
import { toast } from 'sonner';
import { get_recent_sales } from '../../../services/report_contigence.service';
import { invalidate_sale } from '../../../services/sales.service';

export const useInvalidationStore = create<IInvalidationStore>((set) => ({
  isLoading: false,
  isError: false,
  errorMessage: '',
  sales: [],

  OnCreateInvalidation: async (id: number, invalidationData: ISignInvalidationData) => {
    try {
      set({ isLoading: true, isError: false });
      await firmarDocumentoInvalidacion(invalidationData).then((res) => {
        set({ isLoading: true, isError: false });
        if (res.status === 200) {
          send_to_mh_invalidation({
            ambiente: ambiente,
            version: 2,
            idEnvio: 1,
            documento: res.data.body,
          }).then((res) => {
            toast.loading('Enviando...');
            if (res.data.estado === 'PROCESADO') {
              toast.success('Enviado a hacienda');
              set({ isLoading: true, isError: false });

              invalidate_sale(id, String(res.data.selloRecibido)).then((res) => {
                toast.loading('Procesando...');
                if (res.status === 200) {
                  set({ isLoading: false, isError: false });
                  toast.success('Procesado correctamente');
                } else {
                  set({ isLoading: false, isError: true });
                  toast.error(`Error: ${res.data.message}`);
                }
              });
            } else {
              toast.error('Error al enviar el documento a hacienda');
            }
          });
        } else {
          set({ isLoading: false, isError: true });
          toast.error(`Error al enviar el documento a hacienda`);
        }
      });
    } catch (error) {
      set({ isLoading: false, isError: true });
      toast.error('Error al firmar el documento');
    }
  },

  OnGetRecentSales: async (id: number) => {
    await get_recent_sales(id)
      .then((res) => {
        if (res.status === 200) {
          set({ sales: res.data.sales });
        } else {
          set({ sales: [] });
        }
      })
      .catch(() => {
        set({ sales: [] });
        toast.error('Error al obtener las ventas recientes');
      });
  },
}));
