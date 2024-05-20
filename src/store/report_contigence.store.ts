import { create } from "zustand";
import { ISalesContigenceStore } from "../types/report_contigence";
import { IPagination } from "../types/global.types";
import {
  get_contigence_not_report,
  get_contigence_report,
} from "../services/report_contigence.service";
import { get_sales_by_status } from "../services/sales.service";

export const useReportContigenceStore = create<ISalesContigenceStore>(
  (set) => ({
    sales: [],
    saless: [],
    pagination_sales: {} as IPagination,
    pagination_saless: {} as IPagination,
    OnGetSalesContigence: async (
      id: number,
      page: number,
      limit: number,
      startDate: string,
      endDate: string
    ) => {
      const { data } = await get_contigence_report(
        id,
        page,
        limit,
        startDate,
        endDate
      );
      set({
        sales: data.sales,
        pagination_sales: {
          total: data.total,
          totalPag: data.totalPag,
          currentPag: data.currentPag,
          nextPag: data.nextPag,
          prevPag: data.prevPag,
          status: data.status,
          ok: data.ok,
        },
      });
    },
    OnGetSalesNotContigence: async (
      id: number,
      page: number,
      limit: number,
      startDate: string,
      endDate: string
    ) => {
      const { data } = await get_contigence_not_report(
        id,
        page,
        limit,
        startDate,
        endDate
      );
      set({
        saless: data.saless,
        pagination_saless: {
          total: data.total,
          totalPag: data.totalPag,
          currentPag: data.currentPag,
          nextPag: data.nextPag,
          prevPag: data.prevPag,
          status: data.status,
          ok: data.ok,
        },
      });
    },

    OnGetSalesByStatus: async (
      id: number,
      page: number,
      limit: number,
      startDate: string,
      endDate: string,
      status: number
    ) => {
      const { data } = await get_sales_by_status(
        id,
        page,
        limit,
        startDate,
        endDate,
        status
      );
      set({
        sales: data.sales,
        pagination_sales: {
          total: data.total,
          totalPag: data.totalPag,
          currentPag: data.currentPag,
          nextPag: data.nextPag,
          prevPag: data.prevPag,
          status: data.status,
          ok: data.ok,
        },
      });
    },
  })
);
