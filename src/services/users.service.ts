import axios from 'axios';
import { API_URL } from '../utils/constants';
import { IGetUserPaginated, IGetUsers, UserPayload, UserUpdate } from '../types/users.types';
import { get_token, get_user } from '../storage/localStorage';

export const get_users_list = () => {
  const token = get_token() ?? '';
  return axios.get<IGetUsers>(API_URL + '/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_user_paginated = (page = 1, limit = 5, userName = '', active: number = 1) => {
  const token = get_token() ?? '';
  const user = get_user();
  return axios.get<IGetUserPaginated>(
    API_URL +
      '/users/paginated/' +
      user?.employee.branch.transmitterId +
      `?page=${page}&limit=${limit}&userName=${userName}&active=${active}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const save_user = (payload: UserPayload) => {
  const token = get_token() ?? '';
  return axios.post<{ ok: boolean }>(API_URL + '/users', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patch_user = (payload: UserUpdate, id: number) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(API_URL + '/users/' + id, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const delete_user = (id: number) => {
  const token = get_token() ?? '';
  return axios.delete<{ ok: boolean }>(API_URL + '/users/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patch_password = (password: string, id: number) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(
    API_URL + '/users/change-password/' + id,
    {
      password,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
