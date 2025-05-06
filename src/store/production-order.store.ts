import { create } from 'zustand';

import { ProductionOrderStore } from './types/production-order.store.types';

import { get_production_orders } from '@/services/production-order.service';

export const useProductionOrderStore = create<ProductionOrderStore>((set) => ({
  productionOrders: [],
  paginationProductionOrders: {
    currentPag: 0,
    total: 0,
    totalPag: 0,
    nextPag: 0,
    prevPag: 0,
    ok: false,
    status: 200,
  },
  loadingProductionOrders: false,
  getProductionsOrders(
    page,
    limit,
    startDate,
    endDate,
    branchId,
    status,
    employeeId,
    productionOrderTypeId
  ) {
    set({ loadingProductionOrders: true });
    get_production_orders(
      page,
      limit,
      startDate,
      endDate,
      branchId,
      status,
      employeeId,
      productionOrderTypeId
    )
      .then((res) => {
        set({
          productionOrders: res.data.productionOrders,
          paginationProductionOrders: res.data,
          loadingProductionOrders: false,
        });
      })
      .catch(() => {
        set({
          productionOrders: [],
          paginationProductionOrders: {
            currentPag: 0,
            total: 0,
            totalPag: 0,
            nextPag: 0,
            prevPag: 0,
            ok: false,
            status: 200,
          },
          loadingProductionOrders: false,
        });
      });
  },
}));
