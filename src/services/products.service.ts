import axios from 'axios';

import {
  ConvertProduct,
  GetBranchProductRecipe,
  GetBranchProductRecipeSupplier,
  GetProductAndRecipe,
  GetProductDetail,
  GetProductRecipeBook,
  IGetCOnvertedProduct,
  IGetProductsPaginated,
  ProductList,
  ProductPayload,
  SearchProduct,
  Verify_Code,
} from '../types/products.types';
import { API_URL } from '../utils/constants';
import { get_token } from '../storage/localStorage';

import { BasicResponse } from '@/types/global.types';
import { IPayloadBranchProduct } from '@/types/branch_products.types';

export const get_products = (search: SearchProduct) => {
  const token = get_token() ?? '';

  const params = new URLSearchParams();
  const active = search.active ? 1 : 0

  params.append('page', search.page.toString());
  params.append('limit', search.limit.toString());
  params.append('category', search.category.toString());
  params.append('subCategory', search.subCategory.toString())
  params.append('name', search.name);
  params.append('code', search.code);
  params.append('active', active.toString());


  return axios.get<IGetProductsPaginated>(
    API_URL +
    `/products/list-paginated?${params.toString()}`,
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

  const params = new URLSearchParams();

  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params.append('category', category.toString());
  params.append('subCategory', subCategory.toString())
  params.append('name', name);
  params.append('code', code);
  params.append('active', active.toString());
  params.append('typeProduct', typeProduct);

  return axios.get<GetProductAndRecipe>(
    API_URL +
    `/products/products-and-recipe?${params.toString()}`,
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

export const create_branch_product = (payload: IPayloadBranchProduct) => {
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

export const get_product_list_search = async ({
  productName,
  code
}: {
  productName?: string;
  code: string;
}) => {
  const token = get_token() ?? '';

  const encodedName = productName ? encodeURIComponent(productName) : '';
  const encodedCode = encodeURIComponent(code);

  return (
    await axios.get<IGetProductsPaginated>(
      `${API_URL}/products/search/list?name=${encodedName}&code=${encodedCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  ).data;
};



export const convert_product = async (payload: ConvertProduct) => {
  const data = axios.post<BasicResponse>(`${API_URL}/products/convert`, payload)

  return data
}

export const get_converted_product = async (id: number) => {
  const data = axios.get<IGetCOnvertedProduct>(`${API_URL}/product-conversions/${id}`)

  return data
}


export const update_product_coversion = async (payload: ConvertProduct, id: number) => {
  const data = axios.patch<BasicResponse>(`${API_URL}/product-conversions/${id}`, payload)

  return data
}
