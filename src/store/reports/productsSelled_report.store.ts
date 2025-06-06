import { create } from "zustand";

import { IProductSelledStore } from "./types/productSelled.report.store.types";

import { initialPagination } from "@/utils/utils";
import { get_products_selled_by_dates, get_products_selled_summary } from "@/services/reports/productsSelled.report.service";

export const useProductsOrdersReportStore = create<IProductSelledStore>((set) => ({
    loading: false,
    loading_summary: false,
    products_selled: {
        ...initialPagination,
        products_sellled: []
    },
    summary_products_selled: {
        ok: false,
        status: 404,
        summary: [],
        totals: {}
    },
    getProductSelledSummary(params) {
        get_products_selled_summary(params).then((data) => {
            set({ summary_products_selled: data })
        }).catch(() => {
            set({
                summary_products_selled: {
                    ok: false,
                    status: 404,
                    summary: [],
                    totals: {}
                }
            })
        })
    },
    getProductsSelled(params) {
        get_products_selled_by_dates(params).then((data) => {
            set({ products_selled: data })
        })
            .catch(() => {
                set({
                    products_selled: {
                        ...initialPagination,
                        products_sellled: []
                    }
                })
            })
    },
}))