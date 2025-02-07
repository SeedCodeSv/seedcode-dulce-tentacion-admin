import axios from 'axios';
import {
  IGetSupplierPagination,
  IGetSuppliers,
  IGetSuppliersById,
  PayloadSupplier,
  Supplier,
} from '../types/supplier.types';
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
  isTransmitter: number | string,
  active = 1
) => {
  const user = get_user();
  const token = get_token() ?? '';
  const params = {
    page: page.toString(),
    nombre: name,
    correo: email,
    limit: limit.toString(),
    isTransmitter: isTransmitter.toString(),
    active: active.toString(),
  }

  const queryString = new URLSearchParams(params).toString();

  return axios.get<IGetSupplierPagination>(
    API_URL +
    `/suppliers/list/${user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0}` +
    '?' + queryString,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const update_supplier = (payload: Supplier, id: number) => {
  delete payload.isActive;
  delete payload.direccion;
  delete payload.direccionId;
  delete payload.transmitter;
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
    API_URL +
    `/suppliers/list-by-transmitter/${user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const activate_supplier = (id: number) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(
    API_URL + '/suppliers/activate/' + id,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const get_supplier_by_id = (id: number) => {
  const token = get_token() ?? '';
  return axios.get<IGetSuppliersById>(API_URL + `/suppliers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_supplier_by_nit = (nit: string) => {
  const token = get_token() ?? '';
  return axios.get<IGetSuppliersById>(API_URL + `/suppliers/by-nit/${nit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};