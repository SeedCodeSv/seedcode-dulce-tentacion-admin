import { get_token } from '@/storage/localStorage';
import {
  ErrorSupplier,
  ICreateShoppingManual,
  IGetCorrelativeShopping,
  IGetShoppingDetails,
  IGetShoppingPaginated,
  IGetShoppingReport,
  IGetShoppingReportByCode,
  SuccessSupplier,
} from '@/types/shopping.types';
import { API_URL } from '@/utils/constants';
import axios from 'axios';

export const create_shopping = (payload: FormData) => {
  return axios.post<ErrorSupplier | SuccessSupplier>(`${API_URL}/shoppings`, payload);
};
export const verify_code = (code: string) => {
  return axios.get<IGetShoppingReportByCode>(`${API_URL}/shoppings/verify-code?code=${code}`)
}

export const create_shopping_manual = (payload: ICreateShoppingManual) => {
  return axios.post(`${API_URL}/shoppings/create`, payload);
};
export const get_shoppings_paginated = (
  id: number,
  page = 1,
  limit = 5,
  fecha: string,
  segundaFecha: string,
  branchId: string
) => {
  const token = get_token() ?? '';
  return axios.get<IGetShoppingPaginated>(
    `${API_URL}/shoppings/list/${id}?page=${page}&limit=${limit}&fecha=${fecha}&segundaFecha=${segundaFecha}&branch=${branchId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const get_correlative_shopping = (branch_id: number) => {
  return axios.get<IGetCorrelativeShopping>(API_URL + `/shoppings/get-correlative/${branch_id}`);
};

export function isErrorSupplier(response: { supplier: boolean }): response is ErrorSupplier {
  return response && typeof response.supplier === 'boolean';
}

export function isSuccessSupplier(response: { ok: boolean }): response is SuccessSupplier {
  return response && typeof response.ok === 'boolean';
}

export const get_shopping_by_month = (transmitterId: number, month: string) => {
  return axios.get<IGetShoppingReport>(
    API_URL + `/reports/get-shoppings-by-month/${transmitterId}?month=${month}`
  );
};

export const get_shopping_by_id = (id: number) => {
  return axios.get<IGetShoppingDetails>(API_URL + `/shoppings/${id}`);
}


export const update_shopping_manual = (id: number, payload: ICreateShoppingManual) => {
  return axios.patch<{ ok: boolean }>(`${API_URL}/shoppings/${id}`, payload);
};


