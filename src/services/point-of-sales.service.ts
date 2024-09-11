import { get_token } from '@/storage/localStorage';
import {
  IGetPointOfSalePaginated,
  IGetPointOfSales,
  IGetPointOfSalesByBranch,
  PayloadPointOfSales,
  PointOfSalePayload,
} from '@/types/point-of-sales.types';
import { API_URL } from '@/utils/constants';

import axios from 'axios';

export const get_point_of_sales = (branchId: number) => {
  const token = get_token() ?? '';
  return axios.get<IGetPointOfSales>(
    `${import.meta.env.VITE_API_URL}/point-of-sale/by-branch/${branchId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const save_point_of_sales = (payload: PointOfSalePayload) => {
  const token = get_token() ?? '';
  return axios.post<{ ok: boolean }>(API_URL + '/point-of-sale/with-user', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_point_of_sale = (
  Transmitter = 0,
  page = 1,
  limit = 5,
  posCode = '',
  branch = '',
  dteType = ''
) => {
  const token = get_token() ?? '';
  return axios.get<IGetPointOfSalePaginated>(
    import.meta.env.VITE_API_URL +
      `/point-of-sale/list-paginated/${Transmitter}?page=${page}&limit=${limit}&posCode=${posCode}&branch=${branch}&dteType=${dteType}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

//Listado de puntos de venta
export const get_point_of_sale_list = (branchId: number) => {
  const token = get_token() ?? '';
  return axios.get<IGetPointOfSalesByBranch>(API_URL + `/branches/by-point-of-sale/${branchId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patch_point_of_sale = (payload: PayloadPointOfSales, id: number) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(
    API_URL + '/point-of-sale/update-point-of-sale/' + id,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verify_code_correlatives = (BranchId: number, posCode: string) => {
  const toke = get_token() ?? '';
  return axios.get<{ ok: boolean }>(
    API_URL + `/point-of-sale/verify-code/${BranchId}?posCode=${posCode}`,
    {
      headers: {
        Authorization: `Bearer ${toke}`,
      },
    }
  );
};
