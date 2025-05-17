import { create } from 'zustand';
import { toast } from 'sonner';

import { messages } from '../../utils/constants';
import { create_promotion_discount_by_product, get_products_by_promotion, remove_products_to_promotion } from '../../services/promotions/promotions_discountByProduct.service';

import { IPromotionsByProductStore } from './types/promotionsByProduct.store';

export const usePromotionsProductsStore = create<IPromotionsByProductStore>((set) => ({
  products: [],
  postPromotions(payload) {
    create_promotion_discount_by_product(payload)
      .then(() => {
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  getProductsByPromotion(id) {
    get_products_by_promotion(id)
      .then(({ data }) => {
        if (data.ok) {
          usePromotionsProductsStore.setState({ products: data.products });
        }
      })
      .catch(() => {
        usePromotionsProductsStore.setState({ products: [] });
        toast.error(messages.error);
      });
  },
  removeProductsToPromotion(id: number, promotionId: number) {
    remove_products_to_promotion(id, promotionId)
      .then(() => {
        usePromotionsProductsStore.getState().products.includes(id) &&
          set((state) => ({ products: state.products.filter((p) => p !== id) }));
        toast.success('Se quito el producto con exito');
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },

  addProductToPromotion(id: number) {
    try {
      if (usePromotionsProductsStore.getState().products.includes(id)) {
        toast.warning('El producto ya existe');

        return;
      } else {
        set((state) => ({ products: [...state.products, id] }));
        toast.success('Se agrego el producto con exito',{position: 'top-center'});
      }
    } catch (error) {
      toast.error(messages.error);
    }
  },
}));
