import { create } from 'zustand';

import { IReportKardexStore } from './types/reportKardex.store';

import { IPagination } from '@/types/global.types';
import { get_adjustments_by_product, get_kardex_report } from '@/services/reports/reportKardex.service';

export const useReportKardex = create<IReportKardexStore>((set) => ({
  kardex: [],
  details: [],
  pagination_kardex: {} as IPagination,
  loading: false,
  OnGetReportKardex(id, page, limit, name) {
    set({ loading: true });
    get_kardex_report(id, page, limit, name)
      .then(({ data }) => {
        set({
          kardex: data.data,
          pagination_kardex: {
            total: data.total,
            totalPag: data.totalPag,
            currentPag: data.currentPag,
            nextPag: data.nextPag,
            prevPag: data.prevPag,
            status: data.status,
            ok: data.ok,
          },
          loading: false,
        });
      })
      .catch(() => {
        set({
          kardex: [],
          pagination_kardex: {
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 0,
            ok: false,
          },
          loading: false,
        });
      });
  },

  OnGetDetailsByProduct(id) {
    set({ loading: true });
    get_adjustments_by_product(id)
      .then(({ data }) => {
        set({ details: data.details, loading: false });
      })
      .catch(() => {
        set({ details: [], loading: false });
      });
  },
}));
