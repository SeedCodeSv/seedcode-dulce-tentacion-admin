import axios from 'axios';

import { CloseZ, ZCashCutsRequest } from '../../types/cashCuts.types';
import { API_URL } from '../../utils/constants';
export const get_cashCuts = (id?: number, startDate?: string, endDate?: string, code?: string) => {
  return axios.get<ZCashCutsRequest>(
    API_URL +
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
    API_URL + '/sales/x-cash-cuts?' + 'branchId=' + id + '&code=' + code
  );
};

export const close_x = (payload: CloseZ) => {
  return axios.post(API_URL + '/cuts', payload);
};
