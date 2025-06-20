import axios from 'axios';

import { API_URL } from '../utils/constants';
import { IGetCustomerById, IGetCustomerInfo, IGetCustomerPagination, IGetCustomers, PayloadCustomer } from '../types/customers.types';
import { get_token, get_user } from '../storage/localStorage';

export const get_customers_pagination = (
  page = 1,
  limit = 5,
  name = '',
  email = '',
  branchName = '',
  isTransmitter: number | string,
  active: number = 1
) => {
  // const user = get_user();
  const token = get_token() ?? '';
  const user = get_user();

  return axios.get<IGetCustomerPagination>(
    API_URL +
      `/customers/all-paginated/${user?.pointOfSale?.branch.transmitterId ?? 0}` +
      '?page=' +
      page +
      '&limit=' +
      limit +
      '&nombre=' +
      name +
      '&correo=' +
      email +
      '&branchName=' +
      branchName +
      '&isTransmitter=' +
      isTransmitter +
      '&active=' +
      active,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const save_customers = (payload: PayloadCustomer) => {
  const token = get_token() ?? '';

  return axios.post<{ ok: boolean }>(API_URL + '/customers', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const update_customers = (payload: PayloadCustomer, id: number) => {
  const token = get_token() ?? '';

  return axios.patch<{ ok: boolean }>(API_URL + '/customers/' + id, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const delete_customer = (id: number) => {
  const token = get_token() ?? '';

  return axios.delete<{ ok: boolean }>(API_URL + '/customers/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const get_customer = () => {
  const user = get_user();

  const token = get_token() ?? '';

  return axios.get<IGetCustomers>(
    API_URL +
      `/customers/list-by-transmitter/${user?.pointOfSale?.branch.transmitterId ?? 0}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const get_customer_by_branch = () => {
  const user = get_user();

  const token = get_token() ?? '';

  return axios.get<IGetCustomers>(
    API_URL +
      `/customers/list-by-branch/${user?.pointOfSale?.branch?.id ?? 0}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const activate_customer = (id: number) => {
  return axios.patch<{ ok: boolean }>(API_URL + '/customers/activate/' + id);
};

export const getCustomerById = (id: number) => {
  const token = get_token() ?? '';

  return axios.get<IGetCustomerById>(API_URL + `/customers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_customer_by_id = (id: number) => {
  const token = get_token() ?? '';

  return axios.get<IGetCustomerById>(API_URL + `/customers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_customer_email = (id: number) => {
  const token = get_token() ?? ''

  return axios.get<IGetCustomerInfo>(API_URL + `/customers/email/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

