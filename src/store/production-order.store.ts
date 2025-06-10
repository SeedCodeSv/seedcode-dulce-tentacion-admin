import { create } from 'zustand';
import { AxiosError } from 'axios';

import { ProductionOrderStore } from './types/production-order.store.types';

import {
  get_production_order_by_id,
  get_production_orders,
  get_verify_production_order,
  verify_products_orders,
} from '@/services/production-order.service';
import { BasicResponse } from '@/types/global.types';
import { IError, RecipeBook, ResponseVerifyProduct } from '@/types/production-order.types';
import { BProductPlusQuantity, BranchProduct } from '@/types/branch_products.types';

export const useProductionOrderStore = create<ProductionOrderStore>((set) => ({
  selectedProducts: [],
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
  verified_product: {} as ResponseVerifyProduct,
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
        const errors: IError[] = [];

        if (data.ok) {
          set({ verified_product: data })
        }

        data.recipeBook.productRecipeBookDetails.forEach((item) => {
          const quantity = Number(item.quantity);
          const stock = Number(item.branchProduct?.stock ?? 0);

          if (!item.branchProduct) {
            errors.push({
              productId: item.product.id,
              nameProduct: item.product.name,
              exist: false,
              description: 'No existe en la Sucursal de Partida',
            });
          } else if (stock <= quantity) {
            errors.push({
              productId: item.product.id,
              nameProduct: item.product.name,
              exist: true,
              description: 'No tiene suficiente stock',
            });
          }
        });

        set({ errors });

        if (errors.length > 0) {
          return {
            ok: false,
            recipeBook: data.recipeBook,
            branchProduct: data.branchProduct,
            status: 400,
            errors
          };
        }

        return {
          ok: true,
          recipeBook: data.recipeBook,
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
          recipeBook: {} as RecipeBook,
          branchProduct: {} as BranchProduct,
          status: error.response?.status ?? 500,
          message,
        };
      });
  },
  addSelectedProducts(products) {
    let data: BProductPlusQuantity [] = []

    products.map((item) => {
      data.push({...item.branchProduct, quantity: item.quantity})
    })

    set({ selectedProducts: data })
  },

}));
