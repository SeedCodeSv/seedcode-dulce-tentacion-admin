import { create } from 'zustand';

import { ProductionOrderTypeStore } from './types/production-order-type.store.types';

import {
  create_production_order_type,
  delete_production_order_type,
  get_production_order_types,
  update_production_order_type,
} from '@/services/production-order-type.service';

export const useProductionOrderTypeStore = create<ProductionOrderTypeStore>((set) => {
  return {
    productionOrderTypes: [],
    loadingProductionOrderTypes: false,
    onGetProductionOrderTypes: () => {
      set({ loadingProductionOrderTypes: true });
      get_production_order_types()
        .then((response) => {
          set({
            productionOrderTypes: response.data.productionOrderTypes,
            loadingProductionOrderTypes: false,
          });
        })
        .catch(() => {
          set({ productionOrderTypes: [], loadingProductionOrderTypes: false });
        });
    },
    onCreateProductionOrderType: async (name) => {
      return await create_production_order_type(name)
        .then(() => true)
        .catch(() => false);
    },
    onUpdateProductionOrderType: async (id, name) => {
      return await update_production_order_type(id, name)
        .then(() => true)
        .catch(() => false);
    },
    onDeleteProductionOrderType: async (id) => {
      return await delete_production_order_type(id)
        .then(() => true)
        .catch(() => false);
    },
  };
});
