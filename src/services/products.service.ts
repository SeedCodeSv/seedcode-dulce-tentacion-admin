import axios from 'axios';
import { IGetProductsPaginated, ProductList, ProductPayload } from '../types/products.types';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';

export const get_products = (page = 1, limit = 5, category = '', name = '', active = 1) => {
  const token = get_token() ?? '';
  return axios.get<IGetProductsPaginated>(
    API_URL +
      `/products/list-paginated?page=${page}&limit=${limit}&category=${category}&name=${name}&active=${active}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const create_products = (values: ProductPayload) => {
  const token = get_token() ?? '';
  return axios.post<{ ok: boolean }>(API_URL + '/products', values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const get_promotions_products_list = () => {
  const token = get_token() ?? '';
  return axios.get<ProductList>(API_URL + `/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const update_products = (values: ProductPayload, id: number) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(API_URL + '/products/' + id, values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const delete_products = (id: number) => {
  const token = get_token() ?? '';
  return axios.delete<{ ok: boolean }>(API_URL + '/products/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const activate_product = (id: number) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(
    API_URL + '/products/activate/' + id,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
