import axios from 'axios';

import { GetProductionOrder, GetProductionOrders, GetVerifyProductionOrder, IPayloadVerifyProducts, ResponseVerifyProduct } from '@/types/production-order.types';
import { API_URL } from '@/utils/constants';

export const get_production_orders = (
  page: number,
  limit: number,
  startDate: string,
  endDate: string,
  branchId: number = 0,
  status: string = '',
  employeeId: number = 0,
  productionOrderTypeId: number = 0
) => {
  const params = new URLSearchParams();

  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  params.append('branchId', branchId.toString());
  params.append('statusOrder', status);
  params.append('employeeId', employeeId.toString());
  params.append('productionOrderTypeId', productionOrderTypeId.toString());

  return axios.get<GetProductionOrders>(API_URL + `/production-orders?${params.toString()}`);
};

export const get_production_order_by_id = (id: number) => {
  return axios.get<GetProductionOrder>(API_URL + `/production-orders/${id}`);
};

export const get_verify_production_order = (id: number) => {
  return axios.get<GetVerifyProductionOrder>(API_URL + `/production-orders/verify-order/${id}`);
};

export const verify_products_orders = (payload: IPayloadVerifyProducts) => {
  return axios.post<ResponseVerifyProduct>(API_URL + '/branch-products/verify-recipe-product' , payload )

}

