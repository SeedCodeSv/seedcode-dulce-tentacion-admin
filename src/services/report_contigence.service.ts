import axios from 'axios';

import { IResponseContigence, IResponseNotContigence } from '../types/report_contigence';
import { API_URL } from '../utils/constants';
import { IGetRecentSales } from '../types/DTE/invalidation.types';

export const get_contigence_report = (
  id: number,
  page: number,
  limit: number,
  startDate: string,
  endDate: string
) => {
  return axios.get<IResponseContigence>(
    API_URL +
      `/sales/get-contigencia/${id}?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
  );
};

export const get_contigence_not_report = (
  id: number,
  page: number,
  limit: number,
  startDate: string,
  endDate: string
) => {
  return axios.get<IResponseNotContigence>(
    API_URL +
      `/sales/get-not-contigencia/${id}?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
  );
};

export const get_recent_sales = (id: number) => {
  return axios.get<IGetRecentSales>(API_URL + '/sales/get-recents/' + id);
};