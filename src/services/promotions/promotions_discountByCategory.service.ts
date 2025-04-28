import axios from 'axios';

import { get_token } from '../../storage/localStorage';
import { API_URL } from '../../utils/constants';
import { PromotionPayloadByCategory, PromotionPayloadByProductos } from '../../types/promotions/promotionsByCategory.types';

export const create_promotion_discount_by_category = (values: PromotionPayloadByCategory) => {
  const token = get_token() ?? '';

  return axios.post<{ ok: boolean }>(API_URL + '/promotion-discounts/for-categories', values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
};

export const patch_promotion_category = (id: number, payload: PromotionPayloadByCategory) => {
  const token = get_token() ?? '';

  return axios.patch<{ ok: boolean }>(API_URL + '/promotion-discounts/categories/' + id, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const patch_promotion_product = (id: number, payload: PromotionPayloadByProductos) => {
  const token = get_token() ?? '';

  return axios.patch<{ ok: boolean }>(API_URL + '/promotion-discounts/products/' + id, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

