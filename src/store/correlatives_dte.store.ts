import { create } from 'zustand';

import { get_correlatives_dte, get_correlatives_dte_point_of_sales, get_point_of_sales } from '../services/correlatives_dte.service';

import { ICorrelativesDteStore } from './types/correlatives_dte.store.types';

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
  getCorrelativeByPointOfSaleDte(transmitter_id, dte) {
    return get_correlatives_dte_point_of_sales(transmitter_id, dte)
      .then(({ data }) => data.correlativo)
      .catch(() => undefined)
  }
}));
