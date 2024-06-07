import { PromotionPayload } from '../../../types/promotions/promotionsByProduct.types';

export interface IPromotionsByProductStore {
  postPromotions: (payload: PromotionPayload) => void;
}
