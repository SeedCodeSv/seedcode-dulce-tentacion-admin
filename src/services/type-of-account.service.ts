import { get_token } from '@/storage/localStorage';
import { IGetTypeOfAccountPaginated, ITypeOfAccountList, ITypeOfAccountPayload } from '@/types/type-of-account.types';
import { API_URL } from '@/utils/constants';
import axios from 'axios';

export const get_type_of_accounts = (page: number, limit: number, name: string) => {
  const token = get_token();
  return axios.get<IGetTypeOfAccountPaginated>(
    `${API_URL}/type-of-account?page=${page}&limit=${limit}&name=${name}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const create_type_of_account = (payload: ITypeOfAccountPayload) => {
  const token = get_token();
  return axios.post(`${API_URL}/type-of-account`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const update_type_of_account = (id: number, payload: ITypeOfAccountPayload) => {
  const token = get_token();
  return axios.patch(`${API_URL}/type-of-account/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const delete_type_of_account = (id: number) => {
  const token = get_token();
  return axios.delete(`${API_URL}/type-of-account/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_type_of_account_list = () => {
  const token = get_token();
  return axios.get<ITypeOfAccountList>(`${API_URL}/type-of-account/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};