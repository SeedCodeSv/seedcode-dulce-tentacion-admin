import { create } from 'zustand';

import { IReportKardexStore } from './types/reportKardex.store';

import { get_adjustments_by_product, get_kardex_report, get_kardex_report_by_product } from '@/services/reports/reportKardex.service';
import { initialPagination } from '@/utils/utils';

export const useReportKardex = create<IReportKardexStore>((set) => ({
  kardex: [],
  details: [],
  pagination_kardex: initialPagination,
  loading: false,
  KardexProduct: [],
  paginationKardexProduct: initialPagination,
  isLoadinKarProd: false,
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
          pagination_kardex: initialPagination,
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
  async getReportKardexByProduct(...params) {
    set({ isLoadinKarProd: true });

    try {
      const res = await get_kardex_report_by_product(...params);

      if (!res.ok) {
        return set({ KardexProduct: [], paginationKardexProduct: initialPagination });
      }

      set({
        KardexProduct: res.movements,
        paginationKardexProduct: {
          total: res.total,
          totalPag: res.totalPag,
          currentPag: res.currentPag,
          nextPag: res.nextPag,
          prevPag: res.prevPag,
          status: res.status,
          ok: res.ok,
        },
      });
    } catch {
      set({ KardexProduct: [], paginationKardexProduct: initialPagination });
    } finally {
      set({ isLoadinKarProd: false });
    }
  },

}));
