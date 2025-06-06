import {
  BranchProduct,
  IBranchProductOrder,
  IBranchProductOrderQuantity,
  ICartProduct,
  IGetBranchProductPaginated,
  SupplierProducts,
} from '../../types/branch_products.types';

import { Branches } from '@/types/branches.types';
import { IGetBranchProductOrderPaginated } from '@/types/branch_product_order.types';
import { BranchProductRecipe, BranchProductRecipeSupplier, UpdateBranchProductOrder } from '@/types/products.types';
import { IPagination } from '@/types/global.types';
import { FC_CuerpoDocumentoItems } from '@/types/svf_dte/fc.types';

export interface IBranchProductStore {
  branch_products: BranchProduct[];
  pagination_branch_products: IGetBranchProductPaginated;
  branchProductsFilteredList: BranchProduct[];
  cart_products: ICartProduct[];
  branch_product_order: IBranchProductOrder[];
  order_branch_products: IBranchProductOrderQuantity[];
  orders_by_supplier: SupplierProducts[];
  branches_list: Branches[];
  branch_product_order_paginated_loading: boolean;
  branchProductRecipe: BranchProductRecipe[];
  branchProductRecipeSupplier: BranchProductRecipeSupplier[];
  loadingBranchProductRecipe: boolean;
  branchProductRecipePaginated: IPagination;
  getBranchProductsFilteredList: (params: { branchId: number; productName?: string }) => void;
  getBranchProductsRecipe: (
    id: number,
    page: number,
    limit: number,
    category: string,
    name?: string,
    code?: string,
    typeProduct?: string
  ) => void;
  getBranchProductOrders: (
    branch: string,
    supplier?: string,
    product?: string,
    code?: string,
    page?: number,
    limit?: number
  ) => void;
  getBranchProductRecipeSupplier: (
    id: number,
    branchProductId: number,
    page: number,
    limit: number,
    category: string,
    name?: string,
    code?: string,
    typeProduct?: string
  ) => void;
  getPaginatedBranchProducts: (
    branchId: number,
    page?: number,
    limit?: number,
    name?: string,
    code?: string
  ) => void;

  branch_product_order_paginated: IGetBranchProductOrderPaginated;
  // & Orders
  addProductOrder: (product: IBranchProductOrder) => void;
  deleteProductOrder: (id: number) => void;
  updateQuantityOrders: (id: number, quantity: number) => void;
  updatePriceOrders: (id: number, price: number) => void;
  clearProductOrders: () => void;
  getProductByCodeOrders: (
    branch: string,
    supplier?: string,
    product?: string,
    code?: string
  ) => void;
  // ! Cart
  addProductCart: (product: BranchProduct) => void;
  deleteProductCart: (id: number) => void;
  emptyCart: () => void;
  onPlusQuantity: (id: number) => void;
  onMinusQuantity: (id: number) => void;
  onRemoveProduct: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  getProductByCode: (transmitter_id: number, code: string) => void;
  getBranchesList: () => void;
  onAddProductsByList: (id: number, cuerpoDescuento: FC_CuerpoDocumentoItems[]) => void;
  patchBranchProduct: (id: number, payload: UpdateBranchProductOrder) => Promise<boolean>
}
