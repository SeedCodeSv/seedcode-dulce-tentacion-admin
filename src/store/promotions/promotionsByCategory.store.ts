import { create } from 'zustand';
import { toast } from 'sonner';
import { messages } from '../../utils/constants';
import { IPromotionsByCategoryStore } from './types/promotionsByCategory.store';
import { create_promotion_discount_by_category, patch_promotion_category, patch_promotion_product } from '../../services/promotions/promotions_discountByCategory.service';

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
  updatePromotionProduct(id, payload) {
    patch_promotion_product(id, payload).then(() => {
      toast.success(messages.success);
    });
  },

  updatePromotionCategory(id, payload) {
    return patch_promotion_category(id, payload)
    .then((res) => {
      toast.success(messages.success);
      return res.data.ok
    })
    .catch(() => {
      toast.warning(messages.error);
      return false;
    })
  },
}));
