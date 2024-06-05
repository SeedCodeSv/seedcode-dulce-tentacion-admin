import { PromotionPayload } from '../../../types/promotions.types';

export interface IPromotionsStore {
  postPromotions: (payload: PromotionPayload) => void;
}
