import { create } from "zustand";

import { OrderProductState } from "./types/order-product.store.types";

import { get_order_products, get_order_products_paginated } from "@/services/order-product.service";
import { initialPagination } from "@/utils/utils";

export const useOrderProductStore = create<OrderProductState>((set) => ({
    orders: [],
    ordersProducts:
    {
        ...initialPagination,
        order_products: []
    },
    loading: false,
    loading_orders: false,
    getOrdersByBranch: (branchId: number) => {
        set({ loading: true })
        get_order_products(branchId).then(({ data }) => {
            set({ orders: data.orders, loading: false })
        }).catch(() => {
            set({ orders: [], loading: false })
        })
    },
    getOrdersByDates(params) {
        set({ loading_orders: true })
        get_order_products_paginated(params).then(({ data }) => {
            set({ ordersProducts: data })
        }).catch(() => {
            set({
                ordersProducts: {
                    ...initialPagination,
                    order_products: []
                }
            })
        })
    },
}))