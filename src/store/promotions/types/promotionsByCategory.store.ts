import { PromotionPayloadByCategory, PromotionPayloadByProductos } from "../../../types/promotions/promotionsByCategory.types";


export interface IPromotionsByCategoryStore {
  postPromotions: (payload: PromotionPayloadByCategory) => void;
  updatePromotionProduct: (id: number, payload: PromotionPayloadByProductos) => void;
  updatePromotionCategory: (id: number, payload: PromotionPayloadByCategory) => void;
}
