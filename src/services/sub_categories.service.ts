import axios from 'axios';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';
import { IGetListSubCategories, IGetSubCategoriesPaginated, ISubCategoryPayload } from '../types/sub_categories.types';



export const create_sub_category = async (payload: ISubCategoryPayload) => {
  const token = get_token();
  return axios.post<{ ok: boolean }>(`${API_URL}/sub-categories`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_sub_categories_list = async () => {
  const token = get_token();
  return axios.get<IGetListSubCategories>(`${API_URL}/sub-categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_sub_categories_paginated = async (page: number, limit: number, name: string, active = 1) => {
  const token = get_token();
  return axios.get<IGetSubCategoriesPaginated>(
    `${API_URL}/sub-categories/list-paginated/${page}?limit=${limit}&name=${name}&active=${active}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const update_sub_category = async (payload: ISubCategoryPayload, id: number) => {
  const token = get_token();
  return axios.patch<{ ok: boolean }>(`${API_URL}/sub-categories/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const activate_sub_category = async (id: number) => {
  const token = get_token();
  return axios.patch<{ ok: boolean }>(`${API_URL}/sub-categories/activate/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const delete_sub_category = async (id: number) => {
  const token = get_token();
  return axios.delete<{ ok: boolean }>(`${API_URL}/sub-categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

