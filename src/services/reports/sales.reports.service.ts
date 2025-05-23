import axios from 'axios';

import { API_URL } from '../../utils/constants';
import {
  IGetMostProductSelled,
  IGetSalesByBranchOfCurrentMonth,
  IGetSalesByDay,
  IGetSalesByDayTable,
  IGetSalesByDayTableDetails,
  IGetSalesByMonthAndYear,
  IGetSalesCount,
  IResponseDataProductGrafic,
} from '../../types/reports/sales.reports.types';
import {
  IResponseDataSalesGrafic,
  IResponseDataExpenses,
} from '../../types/reports/branch_product.reports';
import {
  IGetSalesByBranchPointSale,
  IGetSalesByPeriod,
  SalesChartGraphPeriod,
} from '../../types/reports/sales_by_period.report';

import { get_user } from '@/storage/localStorage';

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
export const get_products_most_selled_by_transmitter_table = (
  id: number,
  startDate: string,
  endDate: string,
  branchId: number
) => {
  return axios.get<IGetMostProductSelled>(
    API_URL +
      `/reports/most-product-transmitter-selled-table/${id}?startDate=${startDate}&endDate=${endDate}&branchId=${branchId}`
  );
};

export const get_expense_by_dates_transmitter = (
  id: number,
  startDate: string,
  endDate: string
) => {
  return axios.get(
    API_URL +
      `/reports/expenses-by-dates-transmitter/${id}?startDate=${startDate}&endDate=${endDate}`
  );
};

export const get_sales_by_day_table = (id: number) => {
  return axios.get<IGetSalesByDayTable>(API_URL + `/reports/sales-by-day-table/${id}`);
};

export const get_sales_by_day_table_details = (id: number) => {
  return axios.get<IGetSalesByDayTableDetails>(API_URL + `/reports/sales-by-day-table-details/${id}`);
};

export const get_sales_by_branch_and_current_month_table = (
  id: number,
  startDate: string,
  endDate: string
) => {
  return axios.get<IResponseDataSalesGrafic>(
    API_URL + `/reports/sales-by-transmitter/${id}?startDate=${startDate}&endDate=${endDate}`
  );
};

export const get_expenses_by_day = (id: number, startDate: string, endDate: string) => {
  return axios.get<IResponseDataExpenses>(
    API_URL +
      `/reports/expenses-by-dates-transmitter/${id}?startDate=${startDate}&endDate=${endDate}`
  );
};

export const get_products_most_selled_by_transmitter_grafic = (
  id: number,
  startDate: string,
  endDate: string
) => {
  return axios.get<IResponseDataProductGrafic>(
    API_URL +
      `/reports/most-product-transmitter-selled/${id}?startDate=${startDate}&endDate=${endDate}`
  );
};

export const get_sales_by_period = (
  page: number,
  limit: number,
  startDate: string,
  endDate: string,
  paymentType: string = '',
  branch: string = '',
  correlative: string = '',
  typeVoucher: string = '',
  point_of_sale: string = ''
) => {
  const user = get_user();

  return axios.get<IGetSalesByPeriod>(
    API_URL +
      `/sales/get-sales-for-dates/${user?.pointOfSale?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0}?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&paymentType=${paymentType}&branch=${branch}&correlative=${correlative}&typeVoucher=${typeVoucher}&pointOfSale=${point_of_sale}`
  );
};

export const get_sales_by_period_chart = (startDate: string, endDate: string) => {
  const user = get_user();

  return axios.get<SalesChartGraphPeriod>(
    API_URL +
      `/sales/graphic/by-branches/${user?.pointOfSale?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0}?startDate=${startDate}&endDate=${endDate}`
  );
};

export const get_sales_point_of_sale_by_branch = (
  id: number,
  startDate: string,
  endDate: string
) => {
  return axios.get<IGetSalesByBranchPointSale>(
    API_URL +
      `/sales/graphic-correlations-for-dates/${id}?startDate=${startDate}&endDate=${endDate}`
  );
};

export const get_sales_count = () => {
  const user = get_user();

  return axios.get<IGetSalesCount>(
    API_URL +
      `/reports/count-sales/${user?.pointOfSale?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0}`
  );
};
