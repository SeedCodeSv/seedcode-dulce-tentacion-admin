import {
  BranchProduct,
  IBranchProductOrder,
  IBranchProductOrderQuantity,
  ICartProduct,
  IGetBranchProductPaginated,
  SupplierProducts,
} from '../../types/branch_products.types';

export interface IBranchProductStore {
  branch_products: BranchProduct[];
  pagination_branch_products: IGetBranchProductPaginated;
  cart_products: ICartProduct[];
  branch_product_order: IBranchProductOrder[];
  order_branch_products: IBranchProductOrderQuantity[];
  orders_by_supplier: SupplierProducts[],
  getBranchProductOrders: (branch: string, supplier?: string, product?: string, code?: string) => void;
  getPaginatedBranchProducts: (
    branchId: number,
    page?: number,
    limit?: number,
    name?: string,
    code?: string
  ) => void;
  // & Orders
  addProductOrder: (product: IBranchProductOrder) => void;
  deleteProductOrder: (id: number) => void;
  updateQuantityOrders: (id: number, quantity: number) => void;
  updatePriceOrders: (id: number, price: number) => void;
  clearProductOrders: () => void;
  getProductByCodeOrders: (branch: string, supplier?: string, product?: string, code?: string) => void
  // ! Cart
  addProductCart: (product: BranchProduct) => void;
  deleteProductCart: (id: number) => void;
  emptyCart: () => void;
  onPlusQuantity: (id: number) => void;
  onMinusQuantity: (id: number) => void;
  onRemoveProduct: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  getProductByCode: (transmitter_id: number, code: string) => void;
}
