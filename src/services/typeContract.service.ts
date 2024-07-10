import axios from 'axios';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';
import { IGetContractTypePaginated } from '../types/contarctType.types';

export const get_contract_type = (page = 1, limit = 8, name = '') => {
  const token = get_token() ?? '';
  return axios.get<IGetContractTypePaginated>(
    API_URL + `/contract-type/list-paginated?page=${page}&limit=${limit}&name=${name}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const create_contract_type = ({ name }: { name: string }) => {
  const token = get_token() ?? '';
  return axios.post<{ ok: boolean }>(
    API_URL + '/contract-type',
    {
      name,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const update_contract_type = ({ name }: { name: string }, id: number) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(
    API_URL + '/contract-type/' + id,
    {
      name,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const delete_contract_type = (id: number) => {
  const token = get_token() ?? '';
  return axios.delete<{ ok: boolean }>(API_URL + '/contract-type/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
