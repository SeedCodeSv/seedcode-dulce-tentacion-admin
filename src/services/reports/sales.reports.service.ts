import axios from 'axios';
import { API_URL } from '../../utils/constants';
import {
  IGetMostProductSelled,
  IGetSalesByBranchOfCurrentMonth,
  IGetSalesByDay,
  IGetSalesByDayTable,
  IGetSalesByMonthAndYear,
} from '../../types/reports/sales.reports.types';
import { IResponseDataExpenses, ISalesByTransmitter } from '../../types/reports/branch_product.reports';

export const get_sales_by_branch_and_current_month = (id: number) => {
  return axios.get<IGetSalesByBranchOfCurrentMonth>(API_URL + `/reports/sales-by-branch/${id}`);
};

export const get_sales_by_month_and_year = (id: number) => {
  return axios.get<IGetSalesByMonthAndYear>(
    API_URL + `/reports/sum-of-month/${new Date().getFullYear()}/${id}`
  );
};

export const get_sales_by_day = (id: number) => {
  return axios.get<IGetSalesByDay>(API_URL + `/reports/sales-by-day/${id}`);
};
export const get_products_most_selled_by_transmitter_table = (id: number, startDate: string, endDate: string) => {
  return axios.get<IGetMostProductSelled>(API_URL + `/reports/most-product-transmitter-selled-table/${id}/${startDate}/${endDate}`);
};

export const get_sales_by_day_table = (id: number) => {
  return axios.get<IGetSalesByDayTable>(API_URL + `/reports/sales-by-day-table/${id}`);
};

export const get_sales_by_branch_and_current_month_table = (id: number , startDate : string, endDate : string) => {
  return axios.get<ISalesByTransmitter>(
    API_URL + `/reports/sales-by-transmitter/${id}?startDate=${startDate}&endDate=${endDate}`
  );
}

export const  get_expenses_by_day = (id: number , startDate : string, endDate : string) => {
  return axios.get<IResponseDataExpenses>(
    API_URL +
      `/reports/expenses-by-dates-transmitter/${id}?startDate=${startDate}&endDate=${endDate}`
  );
}

