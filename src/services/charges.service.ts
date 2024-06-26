import axios from 'axios';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';
import { IChargePayload, IGetChargesPaginated, IGetListCharges } from "../types/charges.types";


export const create_charge = async (payload: IChargePayload) => {
  const token = get_token();
  return axios.post<{ ok: boolean }>(`${API_URL}/charges`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_charges_list = async () => {
  const token = get_token();
  return axios.get<IGetListCharges>(`${API_URL}/charges`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const update_charge = async (payload: IChargePayload, id: number) => {
  const token = get_token();
  return axios.patch<{ ok: boolean }>(`${API_URL}/charges/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
export const get_charges_paginated = async (page: number, limit: number, name: string, active = 1) => {
  const token = get_token();
  return axios.get<IGetChargesPaginated>(
    `${API_URL}/charges/list-paginated?${page}&limit=${limit}&name=${name}&active=${active}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};