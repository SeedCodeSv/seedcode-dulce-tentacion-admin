import { create } from 'zustand';
import { toast } from 'sonner';
import {
  create_promotion_discount,
  get_promotions,
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
