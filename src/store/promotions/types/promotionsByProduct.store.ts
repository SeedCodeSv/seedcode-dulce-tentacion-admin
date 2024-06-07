import { PromotionPayloadByProduct } from '../../../types/promotions/promotionsByProduct.types';

export interface IPromotionsByProductStore {
  postPromotions: (payload: PromotionPayloadByProduct) => void;
}
