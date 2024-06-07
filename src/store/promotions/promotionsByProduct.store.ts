import { create } from 'zustand';
import { toast } from 'sonner';
import { messages } from '../../utils/constants';
import { create_promotion_discount_by_product } from '../../services/promotions/promotions_discountByProduct.service';
import { IPromotionsByProductStore } from './types/promotionsByProduct.store';

export const usePromotionsProductsStore = create<IPromotionsByProductStore>(() => ({
  postPromotions(payload) {
    create_promotion_discount_by_product(payload)
      .then(() => {
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
}));
