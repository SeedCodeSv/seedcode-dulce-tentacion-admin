import { create } from 'zustand';

import { ProductionOrderStore } from './types/production-order.store.types';

import {
  get_production_order_by_id,
  get_production_orders,
  get_verify_production_order,
} from '@/services/production-order.service';

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
  loadingProductionOrder: false,
  productionOrder: null,
  productionOrderDetail: null,
  loadingProductionOrderDetail: false,
  getProductionsOrderDetail(id) {
    set({ loadingProductionOrderDetail: true });
    get_verify_production_order(id)
      .then((res) => {
        set({
          productionOrderDetail: res.data.productionOrder,
          loadingProductionOrderDetail: false,
        });
      })
      .catch(() => {
        set({ productionOrderDetail: null, loadingProductionOrderDetail: false });
      });
  },
  getProductionsOrder(id) {
    set({ loadingProductionOrder: true });
    get_production_order_by_id(id)
      .then((res) => {
        set({ productionOrder: res.data.productionOrder, loadingProductionOrder: false });
      })
      .catch(() => {
        set({ productionOrder: null, loadingProductionOrder: false });
      });
  },
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
