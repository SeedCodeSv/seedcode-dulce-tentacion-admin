import { get_token } from '@/storage/localStorage';
import { IGetTypeOfAccountPaginated } from '@/types/type-of-account.types';
import { API_URL } from '@/utils/constants';
import axios from 'axios';

export const get_type_of_accounts = (page: number, limit: number, name: string) => {
  const token = get_token();
  return axios.get<IGetTypeOfAccountPaginated>(`${API_URL}/type-of-account?page=${page}&limit=${limit}&name=${name}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
