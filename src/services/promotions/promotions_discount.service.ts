import axios from 'axios';
import { PromotionPayload } from '../../types/promotions.types';
import { get_token } from '../../storage/localStorage';
import { API_URL } from '../../utils/constants';
import { IGetPromotionsPaginated } from '../../types/promotions/promotions.types';

export const create_promotion_discount = (values: PromotionPayload) => {
  const token = get_token() ?? '';
  return axios.post<{ ok: boolean }>(API_URL + '/promotion-discounts', values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_promotions = (page = 1, limit = 8, branchId: number, type: string) => {
  const token = get_token() ?? '';
  return axios.get<IGetPromotionsPaginated>(
    API_URL +
      `/promotion-discounts/promos-paginated/${branchId}?page=${page}&limit=${limit}&type=${type}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
