import axios from 'axios';

import { API_URL } from '../../utils/constants';
import {
  IGetReportSalesByDay,
  IGetReportSalesByProduct,
  IGetSalesByCategory,
  IGetSalesByDayTable,
  IGetSalesByYear,
} from '../../types/reports_seller/sales_reports_seller.types';

export const get_sales_by_category = (id: number) => {
  return axios.get<IGetSalesByCategory>(API_URL + `/reports/most-category-selled/${id}`);
};

export const get_sales_by_year = (id: number) => {
  return axios.get<IGetSalesByYear>(
    API_URL + `/reports/sum-of-month/${new Date().getFullYear()}/${id}`
  );
};

export const get_sales_by_Product = (id: number) => {
  return axios.get<IGetReportSalesByProduct>(
    API_URL + `/reports/sum-of-month-branch/${new Date().getFullYear()}/${id}`
  );
};

export const get_sales_by_day = (id: number) => {
  return axios.get<IGetReportSalesByDay>(
    API_URL + `/reports/sum-of-month-branch/${new Date().getFullYear()}/${id}`
  );
};

export const compare_sales_current = (id: number) => {
  return axios.get<IGetReportSalesByDay>(API_URL + `/reports/compare-sales-current-week/${id}`);
};

export const get_sales_by_day_table = (id: number) => {
  return axios.get<IGetSalesByDayTable>(API_URL + `/sales/get-by-branch/${id}`);
};
