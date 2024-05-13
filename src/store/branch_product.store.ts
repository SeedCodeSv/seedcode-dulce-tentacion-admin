import { create } from "zustand";
import { IBranchProductStore } from "./types/branch_product.types";
import { get_branch_product } from "../services/branch_product.service";

export const useBranchProductStore = create<IBranchProductStore>((set) => ({
    branch_products: [],
    pagination_branch_products: {
        total: 0,
        totalPag: 0,
        currentPag: 0,
        nextPag: 0,
        prevPag: 0,
        status: 200,
        ok: true,
    },
    getPaginatedBranchProducts(branchId, page = 1, limit = 5, name, code) {
        get_branch_product(branchId, page, limit, name, code).then(({ data }) => {
            set({
                branch_products: data.branchProducts,
                pagination_branch_products: {
                    total: data.total,
                    totalPag: data.totalPag,
                    currentPag: data.currentPag,
                    nextPag: data.nextPag,
                    prevPag: data.prevPag,
                    status: data.status,
                    ok: data.ok,
                }
            })
        }).catch(() => {
            set({
                branch_products: [],
                pagination_branch_products: {
                    total: 0,
                    totalPag: 0,
                    currentPag: 0,
                    nextPag: 0,
                    prevPag: 0,
                    status: 404,
                    ok: false,
                }
            })
        })
    },
}))