import axios from "axios";
import {
    IGetPurchaseOrdersPagination,
    PurchaseOrderPayload,
} from "../types/purchase_orders.types";
import { API_URL } from "../utils/constants";
import { get_token } from "../storage/localStorage";

export const save_order_purchase = (order: PurchaseOrderPayload) => {
    return axios.post<{ ok: boolean }>(API_URL + "/purchase-order", order, {
        headers: {
            Authorization: "Bearer " + get_token(),
        },
    });
};

export const get_order_purchase = (startDate: string, endDate: string, supplier = "") => {
    return axios.get<IGetPurchaseOrdersPagination>(
        API_URL + `/purchase-order?startDate=${startDate}&endDate=${endDate}&supplier=${supplier}`,
        {
            headers: {
                Authorization: "Bearer " + get_token(),
            },
        }
    );
};
