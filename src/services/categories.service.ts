import axios from 'axios';
import { IGetCategories, IGetCategoriesPaginated } from '../types/categories.types';
import { API_URL } from '../utils/constants';
import { get_token, get_user } from '../storage/localStorage';

export const get_products_categories = (page = 1, limit = 8, name = '', active = 1) => {
  const user = get_user();
  const token = get_token() ?? '';
  return axios.get<IGetCategoriesPaginated>(
    API_URL +
      `/category-products/list-paginated/${user?.employee.branch.transmitterId}?page=${page}&limit=${limit}&name=${name}&active=${active}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const create_category = ({ name }: { name: string }) => {
  const token = get_token() ?? '';
  const user = get_user();
  return axios.post<{ ok: boolean }>(
    API_URL + '/category-products',
    {
      name,
      transmitterId: user?.employee.branch.transmitterId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const update_category = ({ name }: { name: string }, id: number) => {
  const token = get_token() ?? '';
  return axios.patch<{ ok: boolean }>(
    API_URL + '/category-products/' + id,
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

export const get_categories = () => {
  const token = get_token() ?? '';
  const user = get_user();
  return axios.get<IGetCategories>(
    API_URL + `/category-products/list-by-transmitter/${user?.employee.branch.transmitterId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const delete_category = (id: number) => {
  const token = get_token() ?? '';
  return axios.delete<{ ok: boolean }>(API_URL + '/category-products/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const activate_category = (id: number) => {
  const token = get_token() ?? '';
  return axios.delete<{ ok: boolean }>(API_URL + '/category-products/activate/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
