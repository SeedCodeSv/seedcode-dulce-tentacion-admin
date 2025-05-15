import axios from "axios";

import {
    IAddProductOrder,
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
    supplier = "",
    state = ""
) => {
    return axios.get<IGetPurchaseOrdersPagination>(
        API_URL +
        `/purchase-order?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&supplier=${supplier}&state=${state}`,
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

export const delete_order_item = (id: number) => {
  return axios.delete<{ ok: boolean }>(
    import.meta.env.VITE_API_URL + `/detail-purchase-order/${id}`,
    {
      headers: {
        Authorization: 'Bearer ' + get_token(),
      },
    }
  );
};

export const add_product_order = (purchaseId: number, data: IAddProductOrder) => {
  delete data.stock;
  
  return axios.post<{ ok: boolean }>(API_URL + `/purchase-order/add-product/${purchaseId}`, data, {
    headers: {
      Authorization: `Bearer ${get_token()}`,
    },
  });
};
