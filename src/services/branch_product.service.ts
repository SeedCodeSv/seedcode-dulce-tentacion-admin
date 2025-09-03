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

  const params = new URLSearchParams();

  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params.append('name', name);
  params.append('code', code);

  return axios.get<IGetBranchProductPaginated>(
    `${API_URL}/branch-products/by-branch-paginated/${id}?${params.toString()}`,
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

  const params = new URLSearchParams();

  params.append('branch', branch)
  params.append('supplier', supplier);
  params.append('name', name);
  params.append('code', code);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  return axios.get<IGetBranchProductOrder>(
    `${API_URL}/branch-products/get-products?${params.toString()}`,
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
  const params = new URLSearchParams();

  params.append('name', productName ?? "");
  const query = `${branchId}?${params.toString()}`;

  return (
    await axios.get<IGetBranchProductPaginated>(`${API_URL}/branch-products/list/${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
};

export const verify_products_stock = async (branchId: number, products: ProductQuery[]) => {
  const data = axios.post<ICheckStockResponse>(`${API_URL}/branch-products/check-stock/${branchId}`, products)

  return data
}

export const get_branch_product_search = async ({
  branchId,
  productName,
}: {
  branchId: number;
  productName?: string;
}) => {
  const token = get_token() ?? '';

  const params = new URLSearchParams();

  params.append('name', productName ?? "");
  const query = `${branchId}?${params.toString()}`;

  return (
    await axios.get<IGetBranchProductPaginated>(`${API_URL}/branch-products/list/search/${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
};
