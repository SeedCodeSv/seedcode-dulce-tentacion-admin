import { create } from 'zustand';

import { IReportKardexStore } from './types/reportKardex.store';

import { get_adjustments_by_product, get_kardex_report, get_kardex_report_by_product, get_kardex_report_general } from '@/services/reports/reportKardex.service';
import { initialPagination } from '@/utils/utils';

export const useReportKardex = create<IReportKardexStore>((set) => ({
  kardex: [],
  kardexGeneral: [],
  details: [],
  pagination_kardex: initialPagination,
  loading: false,
  KardexProduct: [],
  totales: {
    initialStock: 0,
    totalEntradas: 0,
    totalSalidas: 0,
    productName: '',
     stockActual: 0,
  },
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
        totales: {
          initialStock: res.initialStock,
          totalEntradas: res.totalEntradas,
          totalSalidas: res.totalSalidas,
          productName: res.productName,
          stockActual: res.stockActual
        },
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
  async getReportKardexByProductExport(params) {

    try {
      const res = await get_kardex_report_by_product(Number(params.branchId), params.page, params.limit, params.productName,params.startDate, params.endDate);

      return { ok: true, KardexProduct: res };

    } catch {
      return {
        ok: false, KardexProduct: {
          movements: [],
          totalEntradas: 0,
          totalSalidas: 0,
          initialStock: 0,
          productName: '',
          stockActual: 0,
          ...initialPagination
        }
      };
    }
  },
  async getReportKardexGeneral(params) {
    set({ loading: true })

    return await get_kardex_report_general(params).then((data) => {

      set({
        kardexGeneral: data.data,
        pagination_kardex: {
          total: data.total,
          totalPag: data.totalPag,
          currentPag: data.currentPag,
          nextPag: data.nextPag,
          prevPag: data.prevPag,
          status: data.status,
          ok: data.ok,
        },
        loading: false
      })
    }).catch(() => {
      set({ kardexGeneral: [], pagination_kardex: initialPagination, loading: false })
    })
  },
  async getReportKardexGeneralExport(params) {
    return await get_kardex_report_general(params).then((data) => {
      return { ok: true, kardexGeneral: data }
    }).catch(() => {
      return {
        ok: false, kardexGeneral: {
          ...initialPagination,
          data: []
        }
      }
    })
  },

}));
