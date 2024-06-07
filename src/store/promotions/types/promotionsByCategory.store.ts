import { PromotionPayloadByCategory } from "../../../types/promotions/promotionsByCategory.types";


export interface IPromotionsByCategoryStore {
  postPromotions: (payload: PromotionPayloadByCategory) => void;
}
