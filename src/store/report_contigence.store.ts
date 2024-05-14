import { create } from "zustand";
import { ISalesContigenceStore } from "../types/report_contigence";
import { get_contigence_report } from "../services/report_contigence.service";

export const useReportContigenceStore = create<ISalesContigenceStore>(
  (set) => ({
    sales: [],
    OnGetSalesContigence: async (id: number, page: number, limit: number) => {
      const { data } = await get_contigence_report(id, page, limit);
      set({ sales: data.sales });
    },
  })
);

