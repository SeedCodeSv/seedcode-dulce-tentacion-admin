import { create } from 'zustand';

import { InventaryCreateStore } from '@/types/inventory_adjustment.types';
import { create_inventory_adjustment, recount_stock_inventory_adjustment } from '@/services/inventory_adjustment.service';
import { get_branch_product_orders } from '@/services/branch_product.service';
export const useIInventoryAdjustmentStore = create<InventaryCreateStore>((set, ) => ({
   branchProducts: [],
  card_products: [],
  pagination_data: {
    total: 0,
    branchProducts: [],
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 200,
    ok: true,
  },
  OnGetProductInventoryAdjustament(branch, supplier, product, code, page = 1, limit = 5) {
    get_branch_product_orders(branch, supplier, product, code, page, limit)
      .then(({ data }) => {
        set({
          branchProducts: data.branchProducts,
          pagination_data: {
            total: data.total,
            branchProducts: [],
            totalPag: data.totalPag,
            currentPag: data.currentPag,
            nextPag: data.nextPag,
            prevPag: data.prevPag,
            status: data.status,
            ok: data.ok,
          },
        });
      })
      .catch(() => {
        set({
          branchProducts: [],
          pagination_data: {
            branchProducts: [],
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
  OnAddProductInventoryAdjustament(branchProduct) {
  set((state) => {
    const productExists = state.card_products.some(
      (product) => product.id === branchProduct.id
    );

    if (!productExists) {
      return {
        card_products: [...state.card_products, branchProduct],
      };
    } else {
      return {
        card_products: state.card_products.filter(
          (cp) => cp.id !== branchProduct.id
        ),
      };
    }
  });
},
  OnDeleteProductInventoryAdjustament(id) {
    set((state) => ({
      card_products: state.card_products.filter((product) => product.id !== id),
    }));
  },
  OnClearProductInventoryAdjustament() {
    set(() => ({
      card_products: [],
    }));
  },
  setBranchProducts: (newProducts) => set({ branchProducts: newProducts }), 
  async OnCreateInventoryAdjustment(data): Promise<{ ok: boolean }> {
    try {
      await create_inventory_adjustment(data);

      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  },
  async OnCreateRecountStockInventoryAdjustment(data): Promise<{ ok: boolean }> {
    try {
      await recount_stock_inventory_adjustment(data);

      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  },
}));
