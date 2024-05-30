import { create } from "zustand";
import { PurchaseOrderStore } from "./types/purchase_orders.types";
import { get_order_purchase, save_order_purchase } from "../services/purchase_orders.service";
import { toast } from "sonner";

export const usePurchaseOrdersStore = create<PurchaseOrderStore>((set) => ({
    purchase_orders: [],
    pagination_purchase_orders: {
        total: 0,
        totalPag: 0,
        currentPag: 0,
        nextPag: 0,
        prevPag: 0,
        status: 0,
        ok: false
    },
    async postPurchaseOrder(data) {
        await save_order_purchase(data).then(() => {
            toast.success("Orden de compra guardada correctamente");
        }).catch(() => {
            toast.error("Error al guardar la orden");
        });
    },
    async getPurchaseOrders(startDate, endDate, supplier) {
        await get_order_purchase(startDate, endDate, supplier).then((res) => {
            set({ purchase_orders: res.data.purchaseOrders });
            set({
                pagination_purchase_orders: {
                    total: res.data.total,
                    totalPag: res.data.totalPag,
                    currentPag: res.data.currentPag,
                    nextPag: res.data.nextPag,
                    prevPag: res.data.prevPag,
                    status: res.data.status,
                    ok: res.data.ok
                }
            });
        }).catch(() => {
            set({ purchase_orders: [] });
            set({
                pagination_purchase_orders: {
                    total: 0,
                    totalPag: 0,
                    currentPag: 0,
                    nextPag: 0,
                    prevPag: 0,
                    status: 0,
                    ok: false
                }
            });

        });
    },
}))