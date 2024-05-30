import { PurchaseOrderPayload } from "../../types/purchase_orders.types";

export interface PurchaseOrderStore {
    postPurchaseOrder: (data: PurchaseOrderPayload) => Promise<void>
}