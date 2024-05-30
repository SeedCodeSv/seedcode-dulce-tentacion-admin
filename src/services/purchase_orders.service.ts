import axios from "axios";
import { PurchaseOrderPayload } from "../types/purchase_orders.types";
import { API_URL } from "../utils/constants";

export const save_order_purchase = (order: PurchaseOrderPayload) => {
    return axios.post<{ ok: boolean }>(API_URL + "/purchase-order", order)
}