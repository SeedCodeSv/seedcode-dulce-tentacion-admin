import { create } from 'zustand';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { ProductionOrderStore } from './types/production-order.store.types';

import {
  get_production_order_by_id,
  get_production_orders,
  get_verify_production_order,
  verify_products_orders,
} from '@/services/production-order.service';
import { BasicResponse } from '@/types/global.types';
import { IError, ResponseVerifyProduct } from '@/types/production-order.types';
import { BranchProduct } from '@/types/branch_products.types';
import { BranchProductRecipe } from '@/types/products.types';

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
  errors: [],
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
 handleVerifyProduct(payload): Promise<ResponseVerifyProduct> {
  return verify_products_orders(payload)
    .then(({ data }) => {
      let errorss: IError[] = [];

      // data es tipo Datum[]
      data.data.forEach((item) => {
        if (item.branchProduct === null) {
          errorss.push({ nameProduct: item.product.name });
        }
      });

      // Setea errores después del bucle, no dentro
      set({ errors: errorss });

      errorss.forEach((item) => {
        toast.info(`No existe ${item.nameProduct} en Sucursal de Partida`);
      });

      return {
        ok: true,
        data: data.data,       
        branchProduct: data.branchProduct,   
        status: 200,          
      };
    })
    .catch((error: AxiosError<BasicResponse>) => {
      const rawMessage = error.response?.data?.message;
      const message = rawMessage
        ? rawMessage.replace('CustomHttpException: ', '')
        : 'Ocurrió un error inesperado';

      return {
        ok: false,
        data: [],
        branchProduct: {} as BranchProductRecipe,
        status: error.response?.status ?? 500,
        message,
      };
    });
}
}));
