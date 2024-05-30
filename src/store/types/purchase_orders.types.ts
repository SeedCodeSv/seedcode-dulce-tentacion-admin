import { IPagination } from "../../types/global.types";
import { PurchaseOrder, PurchaseOrderPayload } from "../../types/purchase_orders.types";

export interface PurchaseOrderStore {
    purchase_orders: PurchaseOrder[],
    pagination_purchase_orders: IPagination,
    getPurchaseOrders: (startDate: string, endDate: string, supplier?: string) => Promise<void>,
    postPurchaseOrder: (data: PurchaseOrderPayload) => Promise<void>
}