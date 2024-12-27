import { get_token } from '@/storage/localStorage';
import { AddItem, GetAccountingItems, VerifyItemCount } from '@/types/accounting-items.types';
import { API_URL } from '@/utils/constants';
import axios from 'axios';

export const create_item = (payload: AddItem) => {
  const token = get_token();
  return axios.post(API_URL + '/items', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_accounting_items = (
  page: number,
  limit: number,
  startDate: string,
  endDate: string
) => {
  const token = get_token();
  return axios.get<GetAccountingItems>(
    `${API_URL}/items/paginate?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verify_item_count = (code: string) => {
  const token = get_token();
  return axios.get<VerifyItemCount>(`${API_URL}/items/verify/${code}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
