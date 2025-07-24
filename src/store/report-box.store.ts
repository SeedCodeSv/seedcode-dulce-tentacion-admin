import { create } from "zustand";

import { reportBoxStore } from "./types/report-boxes.store.types";

import { IPagination } from "@/types/global.types";
import { get_list_paginated_boxes, get_report_excell_boxes } from "@/services/Boxes.service";

export const useReportBoxStore = create<reportBoxStore>((set, get) => ({
    paginated_report: {} as IPagination,
    report_boxes: [],
    export_box_excell: [],
    OnGetPaginatedReportBox(page, limit, branches, startDate, endDate) {
        get().OnGetExportExcell(branches, startDate, endDate)

        return get_list_paginated_boxes(page, limit, branches, startDate, endDate).then(({ data }) => {
            set({
                paginated_report: {
                    total: data.total,
                    totalPag: data.totalPag,
                    currentPag: data.currentPag,
                    nextPag: data.nextPag,
                    prevPag: data.prevPag,
                    status: data.status,
                    ok: data.ok
                },
                report_boxes: data.boxes
            })
        }).catch(() => {
            set({
                report_boxes: [],
                paginated_report: {} as IPagination
            })
        })
    },
    OnGetExportExcell(branches, startDate, endDate) {
        return get_report_excell_boxes(branches, startDate, endDate).then(({ data }) => {
            set({
                export_box_excell: data.boxes
            })
        }).catch(() => {
            set({
                export_box_excell: []
            })
        })
    },
}))