import { create } from "zustand";

import { IProductSelledStore } from "./types/productSelled.report.store.types";

import { initialPagination } from "@/utils/utils";
import { get_products_selled_by_branches, get_products_selled_by_dates, get_products_selled_summary, get_productsSelled_details } from "@/services/reports/productsSelled.report.service";
import { IGetProductsSelled } from "@/types/reports/productsSelled.report.types";

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
    products_selled_by_branches: {
        ok: false,
        status: 404,
        data: [],
        branchTotals: {}
    },
    loading_data: false,
    loading_detailed: false,
    products_selled_detailed: {
        ...initialPagination,
        products_sellled: []
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
        return get_products_selled_by_dates(params)
            .then((data) => {
                set({ products_selled: data });

                return { ok: true, products_selled: data }; // <-- aquí corregido
            })
            .catch(() => {
                const emptyData: IGetProductsSelled = {
                    ...initialPagination,
                    products_sellled: [],
                };

                set({ products_selled: emptyData });

                return { ok: false, products_selled: emptyData };
            });
    },
    getProductsSelledExport(params) {
        return get_products_selled_by_dates(params)
            .then((data) => {

                return { ok: true, products_selled: data };
            })
            .catch(() => {
                const emptyData: IGetProductsSelled = {
                    ...initialPagination,
                    products_sellled: [],
                };

                return { ok: false, products_selled: emptyData };
            });
    },

    getProductSaledByBranches(params) {
        set({ loading_data: true })
        get_products_selled_by_branches(params).then((data) => {
            set({ products_selled_by_branches: data, loading_data: false })
        }).catch(() => {
            set({
                products_selled_by_branches: {
                    ok: false,
                    status: 404,
                    data: [],
                    branchTotals: {}
                },
                loading_data: false
            })
        })
    },
    getProductsSelledDetail(params) {
        return get_productsSelled_details(params)
            .then((data) => {
                set({ products_selled_detailed: data });

            })
            .catch(() => {
                const emptyData: IGetProductsSelled = {
                    ...initialPagination,
                    products_sellled: [],
                };

                set({ products_selled_detailed: emptyData });

            });
    },
    getProductsSelledDetailExport(params) {
        return get_productsSelled_details(params)
            .then((data) => {

                return { ok: true, products_selled: data };
            })
            .catch(() => {
                const emptyData: IGetProductsSelled = {
                    ...initialPagination,
                    products_sellled: [],
                };

                return { ok: false, products_selled: emptyData };
            });
    },
}))