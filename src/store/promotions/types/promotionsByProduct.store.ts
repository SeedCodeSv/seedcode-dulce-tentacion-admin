import { PromotionPayloadByProduct } from '../../../types/promotions/promotionsByProduct.types';

export interface IPromotionsByProductStore {
  products: number[];
  postPromotions: (payload: PromotionPayloadByProduct) => void;
  getProductsByPromotion: (id: number) => void;
  removeProductsToPromotion: (id: number, promotionId: number) => void;
  addProductToPromotion: (id: number) => void;
}
