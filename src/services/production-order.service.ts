import axios from 'axios';

import { GetProductionOrders } from '@/types/production-order.types';
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

  return axios.get<GetProductionOrders>(
    API_URL + `/production-orders?${params.toString()}`
  );
};
