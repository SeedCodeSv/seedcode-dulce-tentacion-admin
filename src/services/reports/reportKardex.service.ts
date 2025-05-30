import axios from 'axios';

import { get_token } from '@/storage/localStorage';
import { IReportKardex, IReportKardexByProduct, IResponseDetailsByProduct } from '@/types/reports/reportKardex.types';


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

export const get_kardex_report_by_product = async (
  id: number,
  page: number,
  limit: number,
  productName: string = '',
  startDate: string = '',
  endDate: string = '',
  branchProductId: number = 0,
) => {
  const token = get_token() ?? '';

  return (
    await axios.get<IReportKardexByProduct>(
      import.meta.env.VITE_API_URL +
        `/reports/kardex-by-product/${id}?page=${page}&limit=${limit}&branchProductId=${branchProductId}&startDate=${startDate}&endDate=${endDate}&productName=${productName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  ).data;
};
