import axios from 'axios';

import { IResponseBranchProductPaginatedSent } from '../types/shipping_branch_product.types';

import { get_token } from '@/storage/localStorage';
import { PayloadPoint } from '@/types/point-of-sales.types';
import { BasicResponse } from '@/types/global.types';

export const get_shopping_products_branch = async (
  branchId: number,
  page: number,
  limit: number,
  name: string,
  category: string,
  supplier: string,
  code: string
) => {
  const params = new URLSearchParams();

  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params.append('name', name);
  params.append('category', category)
  params.append('supplier', supplier)
  params.append('code', code);

  return axios.get<IResponseBranchProductPaginatedSent>(
    import.meta.env.VITE_API_URL +
    `/branch-products/by-branch/${branchId}?${params.toString()}`
  );
};


export const update_correlativo = (id: number, update: PayloadPoint) => {
  const token = get_token()

  return axios.patch<BasicResponse>(`${import.meta.env.VITE_API_URL}/point-of-sale/update-point-of-sale/${id}`, update, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}