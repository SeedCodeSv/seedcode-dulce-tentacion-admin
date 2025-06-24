import axios from 'axios';

import {
  ICheckStockResponse,
  IGetBranchProductOrder,
  IGetBranchProductPaginated,
  ProductQuery,
} from '../types/branch_products.types';
import { API_URL } from '../utils/constants';
import { get_token, get_user } from '../storage/localStorage';

import { IGetBranchesList } from '@/types/branches.types';
import { UpdateBranchProductOrder } from '@/types/products.types';

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


export const update_branch_product = (id: number, payload: UpdateBranchProductOrder) => {
  return axios.patch<{ ok: boolean, message: string }>(`${API_URL}/branch-products/${id}`, payload)

}

export const get_branch_product_list = async ({
  branchId,
  productName,
}: {
  branchId: number;
  productName?: string;
}) => {
  const token = get_token() ?? '';
  const query = `${branchId}?name=${productName ?? ''}`;

  return (
    await axios.get<IGetBranchProductPaginated>(`${API_URL}/branch-products/list/${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
};

export const verify_products_stock = async ( branchId: number, products: ProductQuery[] ) => {
  const data = axios.post<ICheckStockResponse>(`${API_URL}/branch-products/check-stock/${branchId}`, products)

  return data
}