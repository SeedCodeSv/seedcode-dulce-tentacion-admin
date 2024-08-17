import { create } from 'zustand';
import { ICorrelativesDteStore } from './types/correlatives_dte.store.types';
import { get_correlatives_dte, get_point_of_sales } from '../services/correlatives_dte.service';

export const useCorrelativesDteStore = create<ICorrelativesDteStore>((set) => ({
  point_of_sales: [],
  getPointOfSales(branch_id) {
    get_point_of_sales(branch_id)
      .then((result) => {
        if (result) {
          set({ point_of_sales: result.data.correlatives });
        }
      })
      .catch(() => {
        set({ point_of_sales: [] });
      });
  },
  async getCorrelativesByDte(transmitter_id, dte) {
    const result = await get_correlatives_dte(transmitter_id, dte);

    if (result) return result.data.correlativo;
  },
}));
