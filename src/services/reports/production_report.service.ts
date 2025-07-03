import axios from 'axios';

import { get_token } from '@/storage/localStorage';
import { API_URL } from '@/utils/constants';

export interface GetData {
  ok: boolean;
  status: number;
  data: Daum[];
}

export interface Daum {
  detalle: string;
  unidad: string;
  cantidad: number;
}

export const get_production_report = (branchId: number, date: string) => {
  const token = get_token();

  return axios.get<GetData>(API_URL + `/production-orders/get-report-for-produccion/${branchId}?date=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
