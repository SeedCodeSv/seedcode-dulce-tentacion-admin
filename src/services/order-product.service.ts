import axios from "axios"

import { GetOrderProductsByBranch, IGetOrdersProducts, IGroupedOrderData, SearchOrders } from "@/types/order-products.types"
import { SearchGlobal } from "@/types/global.types"

export const get_order_products = (branchId: number) => {
    return axios.get<GetOrderProductsByBranch>(import.meta.env.VITE_API_URL + `/order-product/current-branch-date/${branchId}`)
}

export const get_order_products_paginated = (params: SearchGlobal) => {
    return axios.get<IGetOrdersProducts>(import.meta.env.VITE_API_URL + `/order-product/by-dates/${params.branchId}?page=${params.page}&limit=${params.limit}&startDate=${params.startDate}&endDate=${params.endDate}&status=${params.status}`)
}

export const getOrdersGroupedByProductAndBranch = (params: SearchOrders) => {
  return axios.post<IGroupedOrderData>(
    `${import.meta.env.VITE_API_URL}/order-product/grouped-products`,
    params
  );
};