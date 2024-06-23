import { create } from 'zustand';
import { toast } from 'sonner';
import {
  create_promotion_discount,
  get_promotions,
  patch_promotion_branch,
} from '../../services/promotions/promotions_discount.service';
import { IPromotionsStore } from './types/promotions.store';
import { messages } from '../../utils/constants';

export const usePromotionsStore = create<IPromotionsStore>((set) => ({
  promotion_paginated: [],
  pagination_promotions: {
    promotionsDiscount: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 200,
    ok: true,
  },
  loading_products: false,
  postPromotions(payload) {
    create_promotion_discount(payload)
      .then(() => {
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  patchPromotions(payload, id) {
    return patch_promotion_branch(payload, id)
      .then((res) => {
        toast.success(messages.success);
         
        return res.data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);
        return false;
      });
  },

  getPaginatedPromotions: (
    page = 1,
    limit = 5,
    branchId: number,
    type: string,
    startDate: string,
    endDate: string
  ) => {
    set({ loading_products: true });
    get_promotions(page, limit, branchId, type, startDate, endDate)
      .then((products) => set({ pagination_promotions: products.data, loading_products: false }))
      .catch(() => {
        set({
          loading_products: false,
          pagination_promotions: {
            promotionsDiscount: [],
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 404,
            ok: false,
          },
        });
      });
  },
}));
