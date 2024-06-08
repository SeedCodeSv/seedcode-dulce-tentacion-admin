import { create } from 'zustand';
import { toast } from 'sonner';
import { messages } from '../../utils/constants';
import { IPromotionsByCategoryStore } from './types/promotionsByCategory.store';
import { create_promotion_discount_by_category } from '../../services/promotions/promotions_discountByCategory.service';

export const usePromotionsByCategoryStore = create<IPromotionsByCategoryStore>(() => ({
  postPromotions(payload) {
    create_promotion_discount_by_category(payload)
      .then(() => {
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
}));
