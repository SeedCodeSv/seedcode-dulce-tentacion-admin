import axios from 'axios';
import { IResponseDataSaleInvalidation, IResponseInvalidation } from '../types/sales_types';
import { API_URL } from '@/utils/constants';

export const get_sales_invalidation_table = (
  id: number,
  page: number,
  limit: number,
  startDate: string,
  endDate: string,
  typeVoucher: string,
  pointSale: string,
  status: number
) => {
  return axios.get<IResponseDataSaleInvalidation>(
    API_URL +
      `/sales/sales-by-dates-paginated/${id}?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&typeVoucher=${typeVoucher}&posCode=${pointSale}&status=${status}`
  );
};

export const invalidation_sale = (id: number) => {
  return axios.patch<IResponseInvalidation>(API_URL + `/sales/return-inventory/${id}`);
};
