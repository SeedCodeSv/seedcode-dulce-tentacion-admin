import axios from 'axios';
import { IGetSupplierPagination, IGetSuppliers, PayloadSupplier } from '../types/supplier.types';
import { API_URL } from '../utils/constants';
import { get_token, get_user } from '../storage/localStorage';

export const add_supplier = (payload: PayloadSupplier) => {
  const token = get_token() ?? '';
  return axios.post<{ ok: boolean }>(API_URL + '/suppliers', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_supplier_pagination = (
  page = 1,
  limit = 5,
  name = '',
  email = '',
  isTransmitter: number
) => {
  const user = get_user();
  const token = get_token() ?? '';
  return axios.get<IGetSupplierPagination>(
    API_URL +
      `/suppliers/list/${user?.correlative.branch.transmitterId}` +
      '?page=' +
      page +
      '&limit=' +
      limit +
      '&nombre=' +
      name +
      '&correo=' +
      email +
      '&isTransmitter=' +
      isTransmitter,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const update_supplier = (payload: PayloadSupplier, id: number) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(API_URL + '/suppliers/' + id, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const delete_supplier = (id: number) => {
  const token = get_token() ?? '';
  return axios.delete<{ ok: boolean }>(API_URL + '/suppliers/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_supplier = () => {
  const user = get_user();
  const token = get_token() ?? '';
  return axios.get<IGetSuppliers>(
    API_URL + `/suppliers/list-by-transmitter/${user?.correlative.branch.transmitterId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
