import { BranchProduct } from '../../types/branch_products.types';
import { IPagination } from '../../types/global.types';
import {
  DetailPurchaseOrder,
  IAddProductOrder,
  PurchaseOrder,
  PurchaseOrderPayload,
  Supplier,
  UpdatePurchaseItems,
} from '../../types/purchase_orders.types';

export interface PurchaseOrderStore {
  purchase_orders: PurchaseOrder[];
  pagination_purchase_orders: IPagination;
  pagination_purchase_orders_loading: boolean;
  details_order_purchase: DetailPurchaseOrder[];
   loading_complete: boolean;
  prchase_product_add: BranchProduct[];
  removeProductFromPrchaseProductAdd: (numItem: string) => void;
  getPurchaseOrderDetail: (id: number) => Promise<void>;
  getPurchaseOrders: (
    startDate: string,
    endDate: string,
    page?: number,
    limit?: number,
    supplier?: string,
    state?: string
  ) => Promise<void>;
   updateCostOrder: (id: number, price: string) => void;
    removeProductsFromPrchaseProductAdd: () => void;
  postPurchaseOrder: (data: PurchaseOrderPayload) => Promise<void>;
  updateOrderProduct: (id: number, price: number | string, quantity: number | string) => void;
  updateIvaOrder: (id: number, iva: boolean) => void;
 deleteProductDetail: (item: DetailPurchaseOrder) => void;
  addProductToOrder: (product: BranchProduct) => void;
  deleteProductOrder: (id: number) => void;
  updateQuantityOrder: (numItem: string, quantity: number) => void;
  updatePriceOrder: (id: number, price: number) => void;
  clearProductOrder: () => void;
  updatePurchaseOrder: (id: number, details: UpdatePurchaseItems[]) => Promise<{ ok: boolean }>;  
  OnAddProductOrder: (purchaseId: number, data: IAddProductOrder) => Promise<{ ok: boolean }>;
  onUpdateSupplier: (numItem: string, supplier: Supplier) => void;
  duplicateProduct: (item: DetailPurchaseOrder) => void;

}
