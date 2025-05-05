import axios from 'axios';

import { GetProductionOrderTypes } from '@/types/production-order-type.types';
import { API_URL } from '@/utils/constants';
import { get_token } from '@/storage/localStorage';

export const get_production_order_types = () => {
  const token = get_token() ?? '';

  return axios.get<GetProductionOrderTypes>(API_URL + '/production-order-type', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_production_order_type_by_id = (id: number) => {
  const token = get_token() ?? '';

  return axios.get<GetProductionOrderTypes>(API_URL + `/production-order-type/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const create_production_order_type = (name: string) => {
  const token = get_token() ?? '';

  return axios.post<GetProductionOrderTypes>(
    API_URL + '/production-order-type',
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const update_production_order_type = (id: number, name: string) => {
  const token = get_token() ?? '';

  return axios.patch<GetProductionOrderTypes>(
    API_URL + `/production-order-type/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const delete_production_order_type = (id: number) => {
  const token = get_token() ?? '';

  return axios.delete<GetProductionOrderTypes>(API_URL + `/production-order-type/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
