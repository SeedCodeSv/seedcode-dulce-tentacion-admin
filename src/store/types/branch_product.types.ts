import {
  BranchProduct,
  IBranchProductOrder,
  IGetBranchProductPaginated,
} from '../../types/branch_products.types';

import { Branches } from '@/types/branches.types';
import { IBranchProductOrderQuantity, IGetBranchProductOrderPaginated, Supplier, SupplierProducts } from '@/types/branch_product_order.types';
import { BranchProductRecipe, BranchProductRecipeSupplier, UpdateBranchProductOrder } from '@/types/products.types';
import { IPagination } from '@/types/global.types';

export interface IBranchProductStore {
  branch_products: BranchProduct[];
  founded_products: BranchProduct[]
  pagination_branch_products: IGetBranchProductPaginated;
  branchProductsFilteredList: BranchProduct[];
  branch_product_order: IBranchProductOrder[];
  order_branch_products: IBranchProductOrderQuantity[];
  orders_by_supplier: SupplierProducts[];
  branches_list: Branches[];
  branch_product_order_paginated_loading: boolean;
  branchProductRecipe: BranchProductRecipe[];
  branchProductRecipeSupplier: BranchProductRecipeSupplier[];
  loadingBranchProductRecipe: boolean;
  branchProductRecipePaginated: IPagination;
  loading_data: boolean;
  getBranchProductsFilteredList: (params: { branchId: number; productName?: string }) => Promise<{ ok: boolean, branchPrd: BranchProduct[] }>;
  getBranchProductsSearch: (params: { branchId: number; productName?: string }) => Promise<{ ok: boolean, branchPrd: BranchProduct[] }>;

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
  onUpdateSupplier: (numItem: string, supplier: Supplier) => void;
  onDuplicateProduct: (product: IBranchProductOrderQuantity) => void
  addProductOrder: (product: IBranchProductOrder) => void;
  deleteProductOrder: (numItem: string) => void;
  updateQuantityOrders: (numItem: string, quantity: number) => void;
  updatePriceOrders: (numItem: string, price: number) => void;
  clearProductOrders: () => void;
  removeProductOrder: (id: number) => void;

  // ! branchproduct
  getBranchesList: () => void;
  patchBranchProduct: (id: number, payload: UpdateBranchProductOrder) => Promise<boolean>
}
