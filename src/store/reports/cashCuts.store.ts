import { create } from "zustand";

import { ICutReportStore } from "./types/cashCuts.store.types";

import { get_cuts_report } from "@/services/facturation/cashCuts.service";
import { initialPagination } from "@/utils/utils";

export const useCutReportStore = create<ICutReportStore>((set) => ({
    cashCutsDetailed: {
        ...initialPagination,
        cash_cuts_report: []
    },
    loadingDetailed: false,
    onGetCashCutReportDetailed(params) {
        set({ loadingDetailed: true })

        return get_cuts_report(params).then((data) => {
            set({ cashCutsDetailed: data, loadingDetailed: false })
        }).catch(() => {
            set({
                cashCutsDetailed: {
                    ...initialPagination,
                    cash_cuts_report: []
                },
                loadingDetailed: false
            })
        })
    },

}));