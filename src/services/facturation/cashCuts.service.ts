import axios from 'axios';

import { CloseZ, IGetCutsReport, SearchCutReport, ZCashCutsRequest } from '../../types/cashCuts.types';

import { get_token } from '@/storage/localStorage';
export const get_cashCuts = (id?: number, startDate?: string, endDate?: string, code?: string) => {
  return axios.get<ZCashCutsRequest>(
     import.meta.env.VITE_API_URL +
    '/sales/grant-z-cash-cuts?' +
    'branchId=' +
    id +
    '&startDate=' +
    startDate +
    '&endDate=' +
    endDate +
    '&code=' +
    code
  );
};

export const get_cashCuts_x = (id?: number, code?: string) => {
  return axios.get<ZCashCutsRequest>(
     import.meta.env.VITE_API_URL + '/sales/x-cash-cuts?' + 'branchId=' + id + '&code=' + code
  );
};

export const close_x = (payload: CloseZ) => {
  return axios.post( import.meta.env.VITE_API_URL + '/cuts', payload);
};

export const get_cuts_report = async (params: SearchCutReport) => {
  const token = get_token() ?? '';
  const url = import.meta.env.VITE_API_URL + `/reports/cash-cuts/${params.branchId}?page=${params.page}&limit=${params.limit}&dateFrom=${params.dateFrom}&dateTo=${params.dateTo}&employee=${params.employee}`;

  const response = await axios.get<IGetCutsReport>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
