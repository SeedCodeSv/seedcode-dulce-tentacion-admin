import axios from 'axios';
import { get_token } from '../../storage/localStorage';
import { API_URL } from '../../utils/constants';
import { PromotionPayload } from '../../types/promotions/promotionsByProduct.types';

export const create_promotion_discount_by_product = (values: PromotionPayload) => {
  const token = get_token() ?? '';
  return axios.post<{ ok: boolean }>(API_URL + '/for-products', values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
