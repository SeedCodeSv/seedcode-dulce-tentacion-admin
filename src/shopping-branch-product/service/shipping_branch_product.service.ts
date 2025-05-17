import axios from 'axios';

import { IResponseBranchProductPaginatedSent } from '../types/shipping_branch_product.types';

export const get_shopping_products_branch = async (
  branchId: number,
  page: number,
  limit: number,
  name: string,
  category: string,
  supplier: string,
  code: string
) => {
  return axios.get<IResponseBranchProductPaginatedSent>(
    import.meta.env.VITE_API_URL +
      `/branch-products/by-branch/${branchId}?page=${page}&limit=${limit}&name=${name}&category=${category}&supplier=${supplier}&code=${code}&`
  );
};
