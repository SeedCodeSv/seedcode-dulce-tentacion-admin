import axios from 'axios';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';
import {  IGetChargesPaginated, IGetListCharges } from "../types/charges.types";


export const create_charge = ({ name }: { name: string }) => {
  const token = get_token() ?? '';
  return axios.post<{ ok: boolean }>(
    API_URL + '/charges',
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

export const get_charges_list = async () => {
  const token = get_token();
  return axios.get<IGetListCharges>(`${API_URL}/charges`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const update_charge = ({ name }: { name: string }, id: number) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(
    API_URL + '/charges/' + id,
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

export const delete_charge = async (id: number) => {
  const token = get_token();
  return axios.delete<{ ok: boolean }>(`${API_URL}/charges/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const activate_charge = async (id: number) => {
  const token = get_token();
  return axios.patch<{ ok: boolean }>(`${API_URL}/charges/activate/${id}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_charges_paginated = (page = 1, limit = 5, name = '', active = 1) => {
  const token = get_token() ?? '';
  return axios.get<IGetChargesPaginated>(
    API_URL +
      `/charges/list-paginated?page=${page}&limit=${limit}&name=${name}&active=${active}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
// export const get_charges_paginated = async (page: number, limit: number, name: string, active = 1) => {
//   const token = get_token();
//   return axios.get<IGetChargesPaginated>(
//     `${API_URL}/charges/list-paginated?${page}&limit=${limit}&name=${name}&active=${active}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );
// };