import { create } from "zustand";

import { IAnnulationssStore } from "./types/anulations.store.types";

import { get_list_invalidations } from "@/services/innvalidations.services";
import { IPagination } from "@/types/global.types";

export const useAnnulations = create<IAnnulationssStore>((set) => ({
    innvalidations: [],
    is_loading: false,
    innvalidations_page: {} as IPagination,
    async getInnvalidations(page, limit, startDate, endDate, type) {
        set({ is_loading: true })
        get_list_invalidations(page, limit, startDate, endDate, type).then((i) => {
            set({
                innvalidations: i.data.innvalidations,
                is_loading: false,
                innvalidations_page: {
                    total: i.data.total,
                    totalPag: i.data.totalPag,
                    currentPag: i.data.currentPag,
                    nextPag: i.data.nextPag,
                    prevPag: i.data.prevPag,
                    status: i.data.status,
                    ok: i.data.ok,
                }
            })
        }).catch(() => {
            set({
                innvalidations: [],
                is_loading: false,
                innvalidations_page: {} as IPagination

            })
        })
    }
}))