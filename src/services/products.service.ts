import axios from 'axios';

import {
  GetBranchProductRecipe,
  GetBranchProductRecipeSupplier,
  GetProductAndRecipe,
  GetProductDetail,
  GetProductRecipeBook,
  IGetProductsPaginated,
  ProductList,
  ProductPayload,
  Verify_Code,
} from '../types/products.types';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';

import { BasicResponse } from '@/types/global.types';
import { IPayloadBranchProduct } from '@/types/branch_products.types';

export const get_products = (
  page = 1,
  limit = 5,
  category = 0,
  subCategory = 0,
  name = '',
  code = '',
  active = 1
) => {
  const token = get_token() ?? '';

  return axios.get<IGetProductsPaginated>(
    API_URL +
    `/products/list-paginated?page=${page}&limit=${limit}&category=${category}&subCategory=${subCategory}&name=${name}&code=${code}&active=${active}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const get_products_and_recipe = (
  page = 1,
  limit = 5,
  category = 0,
  subCategory = 0,
  name = '',
  code = '',
  active = 1,
  typeProduct = ''
) => {
  const token = get_token() ?? '';

  return axios.get<GetProductAndRecipe>(
    API_URL +
      `/products/products-and-recipe?page=${page}&limit=${limit}&category=${category}&subCategory=${subCategory}&name=${name}&code=${code}&active=${active}&typeProduct=${typeProduct}`,
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

export const verify_code_product = (code: string) => {
  return axios.get<Verify_Code>(API_URL + `/branch-products/verify-code?code=${code}`);
};

export const get_product_recipe_book = (id: number) => {
  return axios.get<GetProductRecipeBook>(API_URL + `/product-recipe-book/product/${id}`);
};

export const get_product_by_id = (id: number) => {
  const token = get_token() ?? '';

  return axios.get<GetProductDetail>(API_URL + `/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_branch_product_recipe = (
  id: number,
  page = 1,
  limit = 5,
  category = '',
  name = '',
  code = '',
  typeProduct = ''
) => {
  const token = get_token() ?? '';

  const params = new URLSearchParams();

  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params.append('category', category);
  params.append('name', name);
  params.append('code', code);
  params.append('typeProduct', typeProduct);

  return axios.get<GetBranchProductRecipe>(
    API_URL + `/branch-products/get-products-and-recipe/${id}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const create_branch_product = (payload: IPayloadBranchProduct) =>{
  return axios.post<BasicResponse>(API_URL + '/branch-products/add/branch-product', payload)
}
export const get_branch_product_recipe_supplier = (
  id: number,
  branchProductId = 0,
  page = 1,
  limit = 5,
  category = '',
  name = '',
  code = '',
  typeProduct = ''
) => {
  const token = get_token() ?? '';

  const params = new URLSearchParams();

  params.append('branchProductId', branchProductId.toString());
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params.append('category', category);
  params.append('name', name);
  params.append('code', code);
  params.append('typeProduct', typeProduct);

  return axios.get<GetBranchProductRecipeSupplier>(
    API_URL + `/branch-products/get-products-and-recipe-supplier/${id}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};