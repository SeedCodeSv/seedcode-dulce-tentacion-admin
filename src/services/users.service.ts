import axios from 'axios';
import { API_URL } from '../utils/constants';
import {
  IGetUserPaginated,
  IGetUsers,
  IResponseRoles,
  UserPayload,
  UserUpdate,
} from '../types/users.types';
import { get_token } from '../storage/localStorage';

export const get_users_list = () => {
  const token = get_token() ?? '';
  return axios.get<IGetUsers>(API_URL + '/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_user_paginated = (
  transmitterId: number,
  page = 1,
  limit = 5,
  userName = '',
  role = '',
  active: number = 1
) => {
  const token = get_token() ?? '';

  return axios.get<IGetUserPaginated>(
    API_URL +
      '/users/paginated/' +
      transmitterId +
      `?&page=${page}&limit=${limit}&userName=${userName}&role=${role}&active=${active}`,
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

export const get_roles_list = () => {
  const token = get_token() ?? '';
  return axios.get<IResponseRoles>(API_URL + '/roles', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const activate_user = (id: number) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(
    API_URL + '/users/activate/' + id,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
