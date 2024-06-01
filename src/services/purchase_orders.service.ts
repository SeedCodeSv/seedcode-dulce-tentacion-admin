import axios from "axios";
import {
    IGetDetailsPurchaseOrder,
    IGetPurchaseOrdersPagination,
    PurchaseOrderPayload,
    UpdatePurchaseItems,
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

export const get_order_purchase = (
    startDate: string,
    endDate: string,
    page = 1,
    limit = 5,
    supplier = ""
) => {
    return axios.get<IGetPurchaseOrdersPagination>(
        API_URL +
        `/purchase-order?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&supplier=${supplier}`,
        {
            headers: {
                Authorization: "Bearer " + get_token(),
            },
        }
    );
};

export const get_details_purchase_order = (id: number) => {
    return axios.get<IGetDetailsPurchaseOrder>(
        API_URL + `/detail-purchase-order/get-by-purchase-Order/${id}`, {
        headers: {
            Authorization: "Bearer " + get_token(),
        },
    }
    );
};

export const update_order = (id: number, order: UpdatePurchaseItems[]) => {
    return axios.patch<{ ok: boolean }>(
        API_URL + `/purchase-order/${id}`,
        { details: order },
        {
            headers: {
                Authorization: "Bearer " + get_token(),
            },
        }
    );
};
