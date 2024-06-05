import axios from 'axios';
import { PromotionPayload } from '../../types/promotions.types';
import { get_token } from '../../storage/localStorage';
import { API_URL } from '../../utils/constants';

export const create_promotion_discount = (values: PromotionPayload) => {
  const token = get_token() ?? '';
  return axios.post<{ ok: boolean }>(API_URL + '/promotion-discounts', values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
