import axios from 'axios';

import { get_token } from '@/storage/localStorage';
import { IReportKardex, IReportKardexByProduct, IReportKardexGeneral, IResponseDetailsByProduct } from '@/types/reports/reportKardex.types';
import { SearchReport } from '@/types/reports/productsSelled.report.types';


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
  branchProductId: number = 0
) => {
  const token = get_token() ?? '';

  const params = new URLSearchParams();

  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params.append('productName', productName);
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  params.append('branchProductId', branchProductId.toString());

  return (
    await axios.get<IReportKardexByProduct>(
      import.meta.env.VITE_API_URL +
      `/reports/kardex-by-product/${id}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  ).data;
};
export const get_kardex_report_general = async (params: SearchReport) => {
  const token = get_token() ?? '';
  const branchQuery = params.branchIds?.map(id => `branchIds=${id}`).join('&') ?? '';
  const encodedName = params.name ? encodeURIComponent(params.name) : '';

  const url =
    import.meta.env.VITE_API_URL +
    `/reports/kardex-general?page=${params.page}&limit=${params.limit}&name=${encodedName}&dateFrom=${params.startDate}&dateTo=${params.endDate}&${branchQuery}`;

  const response = await axios.get<IReportKardexGeneral>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};