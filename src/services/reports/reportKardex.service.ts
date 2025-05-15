import axios from 'axios';

import { get_token } from '@/storage/localStorage';
import { IReportKardex, IResponseDetailsByProduct } from '@/types/reports/reportKardex.types';


export const get_kardex_report = (id: number, page: number, limit: number, name: string) => {
  const token = get_token() ?? '';

  return axios.get<IReportKardex>(
    import.meta.env.VITE_API_URL + `/reports/kardex/${id}?page=${page}&limit=${limit}&name=${name}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const get_adjustments_by_product = (id: number) => {
  const token = get_token() ?? '';

  return axios.get<IResponseDetailsByProduct>(
    import.meta.env.VITE_API_URL + `/inventory-adjustment/by-product/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
