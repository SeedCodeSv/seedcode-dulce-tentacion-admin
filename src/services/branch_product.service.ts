import axios from 'axios';
import {
  IGetBranchProductByCode,
  IGetBranchProductPaginated,
} from '../types/branch_products.types';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';

export const get_branch_product = (id: number, page = 1, limit = 5, name = '', code = '') => {
  const token = get_token() ?? '';
  return axios.get<IGetBranchProductPaginated>(
    `${API_URL}/branch-products/by-branch-paginated/${id}?page=${page}&limit=${limit}&name=${name}&code=${code}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const get_product_by_code = (transmitter_id: number, code: string) => {
  const token = get_token() ?? '';
  return axios.get<IGetBranchProductByCode>(
    `${API_URL}/branch-products/get-code/${transmitter_id}?code=${code}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
