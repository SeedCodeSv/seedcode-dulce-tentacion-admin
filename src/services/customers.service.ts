import axios from 'axios';
import { API_URL } from '../utils/constants';
import { IGetCustomerPagination, IGetCustomers, PayloadCustomer } from '../types/customers.types';
import { get_token, get_user } from '../storage/localStorage';

export const get_customers_pagination = (
  page = 1,
  limit = 5,
  name = '',
  email = '',
  active: number,
  isTransmitter: number
) => {
  const user = get_user();
  const token = get_token() ?? '';
  return axios.get<IGetCustomerPagination>(
    API_URL +
      `/customers/list-paginated/${user?.correlative.branch.transmitterId}` +
      '?page=' +
      page +
      '&limit=' +
      limit +
      '&nombre=' +
      name +
      '&correo=' +
      email +
      '&active=' +
      active +
      '&isTransmitter=' +
      isTransmitter,
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
    API_URL + `/customers/list-by-transmitter/${user?.correlative.branch.transmitterId}`,
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
