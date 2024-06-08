import { PromotionPayload } from '../../../types/promotions.types';
import {
  IGetPromotionsPaginated,
  PromotionDiscount,
} from '../../../types/promotions/promotions.types';

export interface IPromotionsStore {
  promotion_paginated: PromotionDiscount[];
  pagination_promotions: IGetPromotionsPaginated;
  loading_products: boolean;
  postPromotions: (payload: PromotionPayload) => void;
  getPaginatedPromotions: (
    page: number,
    limit: number,
    branchId: number,
    type: string,
    startDate: string,
    endDate: string
  ) => void;
}
