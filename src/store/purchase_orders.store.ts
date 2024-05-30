import { create } from "zustand";
import { PurchaseOrderStore } from "./types/purcahse_orders.types";
import { save_order_purchase } from "../services/purchase_orders.service";
import { toast } from "sonner";

export const usePurchaseOrdersStore = create<PurchaseOrderStore>(() => ({
    async postPurchaseOrder(data) {
        await save_order_purchase(data).then(() => {
            toast.success("Orden de compra guardada correctamente");
        }).catch(() => {
            toast.error("Error al guardar la orden");
        });
    },
}))