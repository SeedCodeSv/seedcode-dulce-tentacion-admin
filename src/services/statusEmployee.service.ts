import axios from 'axios';

import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';
import { IGetStatusEmployeePaginated } from '../types/statusEmployee.types';

export const get_status_employee = (page = 1, limit = 8, name = '', isActive = 1) => {
  const token = get_token() ?? '';

  return axios.get<IGetStatusEmployeePaginated>(
    API_URL +
      `/employee-status/list-paginated?page=${page}&limit=${limit}&name=${name}&isActive=${isActive}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const create_status_employee = ({ name }: { name: string }) => {
  const token = get_token() ?? '';

  return axios.post<{ ok: boolean }>(
    API_URL + '/employee-status',
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

export const update_status_employee = ({ name }: { name: string }, id: number) => {
  const token = get_token() ?? '';

  return axios.patch<{ ok: boolean }>(
    API_URL + '/employee-status/' + id,
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

export const delete_status_employee = (id: number) => {
  const token = get_token() ?? '';

  return axios.delete<{ ok: boolean }>(API_URL + '/employee-status/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const activate_status_employee = (id: number) => {
  const token = get_token() ?? '';

  return axios.patch<{ ok: boolean }>(
    API_URL + '/employee-status/active/' + id,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
