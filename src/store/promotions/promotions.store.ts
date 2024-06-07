import { create } from 'zustand';
import { toast } from 'sonner';
import { create_promotion_discount } from '../../services/promotions/promotions_discount.service';
import { IPromotionsStore } from './types/promotions.store';
import { messages } from '../../utils/constants';

export const usePromotionsStore = create<IPromotionsStore>(() => ({
  postPromotions(payload) {

    create_promotion_discount(payload)
      .then(() => {
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
}));
