import axios from 'axios';

import { CloseZ, IGetCutsReport, IGetCutsReportSummary, IGetDataBox, SearchCutReport, ZCashCutsRequest } from '../../types/cashCuts.types';

import { get_token } from '@/storage/localStorage';
import { IResponseCut } from '@/types/printeCut.types';
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
  return axios.post(import.meta.env.VITE_API_URL + '/cuts', payload);
};

export const get_cuts_report = async (params: SearchCutReport) => {
  const token = get_token() ?? '';
  const branchQuery = params.branchIds?.map(id => `branchIds=${id}`).join('&') ?? '';

  const url = import.meta.env.VITE_API_URL + `/reports/cash-cuts?page=${params.page}&limit=${params.limit}&dateFrom=${params.dateFrom}&dateTo=${params.dateTo}&employee=${params.employee}&${branchQuery}`;

  const response = await axios.get<IGetCutsReport>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}


export const get_cuts_report_summary = async (params: SearchCutReport) => {
  const token = get_token() ?? '';

  const branchQuery = params.branchIds?.map(id => `branchIds=${id}`).join('&') ?? '';

  const url = `${import.meta.env.VITE_API_URL}/reports/cash-cuts-summary?page=${params.page}&limit=${params.limit}&dateFrom=${params.dateFrom}&dateTo=${params.dateTo}&${branchQuery}`;

  const response = await axios.get<IGetCutsReportSummary>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


export const get_data_box = (branchId: number, date: string) => {
  const token = get_token();

  return axios.get<IGetDataBox>(import.meta.env.VITE_API_URL + `/sales/boxes-by-branch/${branchId}?startDate=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};


export const get_cutz_boxes = (branchId: number, date: string) => {
  const token = get_token();

  return axios.get<IResponseCut>(import.meta.env.VITE_API_URL + `/sales/get-cuts-by-branch/${branchId}?startDate=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};