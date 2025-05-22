import axios from 'axios';

import {
  IGetBranchProductByCode,
  IGetBranchProductOrder,
  IGetBranchProductPaginated,
} from '../types/branch_products.types';
import { API_URL } from '../utils/constants';
import { get_token, get_user } from '../storage/localStorage';

import { IGetBranchesList } from '@/types/branches.types';

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

// export const get_branch_product_orders = (branch: string, supplier = '', name = '', code = '') => {
//   const token = get_token() ?? '';
//   return axios.get<IGetBranchProductOrder>(
//     `${API_URL}/branch-products/get-products?branch=${branch}&supplier=${supplier}&name=${name}&code=${code}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };
export const get_branch_product_orders = (
  branch: string,
  supplier = '',
  name = '',
  code = '',
  page = 1,
  limit = 5
) => {
  const token = get_token() ?? '';

  return axios.get<IGetBranchProductOrder>(
    `${API_URL}/branch-products/get-products?branch=${branch}&supplier=${supplier}&name=${name}&code=${code}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const get_branches = () => {
  const user = get_user();
  const token = get_token() ?? '';

  return axios.get<IGetBranchesList>(
    API_URL +
      `/branches/list-by-transmitter/${user?.pointOfSale?.branch.transmitterId ?? 0}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
