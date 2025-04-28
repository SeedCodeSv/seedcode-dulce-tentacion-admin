import axios from 'axios';

import { get_token } from '../../storage/localStorage';
import { API_URL } from '../../utils/constants';
import { PromotionPayloadByProduct } from '../../types/promotions/promotionsByProduct.types';

export const create_promotion_discount_by_product = (values: PromotionPayloadByProduct) => {
  const token = get_token() ?? '';

  return axios.post<{ ok: boolean }>(API_URL + '/promotion-discounts/for-products', values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_products_by_promotion = (id: number) => {
  const token = get_token() ?? '';

  return axios.get<{ ok: boolean; products: number[]; status: number }>(
    API_URL + '/promotion-products/by-promotion/' + id,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const remove_products_to_promotion = (id: number, promotionId: number) => {
  const token = get_token() ?? '';

  return axios.delete<{ ok: boolean }>(API_URL + '/promotion-products/' + id + '/' + promotionId, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}; 
