import axios from 'axios';
import { API_URL } from '../utils/constants';
import { get_token, get_user } from '../storage/localStorage';
import {
  CategoryExpensePayload,
  IGetCategoryExpensesList,
  IGetCategoryExpensesPaginated,
} from '../types/categories_expenses.types';

export const save_categories_expenses = (payload: CategoryExpensePayload) => {
  const token = get_token() ?? '';
  return axios.post<{ ok: boolean }>(API_URL + '/category-expenses', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const get_categories_expenses_paginated = (page: number, limit: number, name: string) => {
  const token = get_token() ?? '';
  const user = get_user();
  return axios.get<IGetCategoryExpensesPaginated>(
    API_URL +
      `/category-expenses/paginated/${user?.correlative.branch.transmitterId}?page=${page}&limit=${limit}&name=${name}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const get_List_categories_expenses = () => {
  const token = get_token() ?? '';
  return axios.get<IGetCategoryExpensesList>(API_URL + '/category-expenses', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const update_categories_expenses = (id: number, payload: CategoryExpensePayload) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(API_URL + '/category-expenses/' + id, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const delete_categories_expenses = (id: number) => {
  const token = get_token() ?? '';
  return axios.delete<{ ok: boolean }>(API_URL + '/category-expenses/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
