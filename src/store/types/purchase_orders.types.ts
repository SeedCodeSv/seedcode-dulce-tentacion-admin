import { BranchProduct } from '../../types/branch_products.types';
import { IPagination } from '../../types/global.types';
import {
  DetailOrderItems,
  PurchaseOrder,
  PurchaseOrderPayload,
  UpdatePurchaseItems,
} from '../../types/purchase_orders.types';

export interface PurchaseOrderStore {
  purchase_orders: PurchaseOrder[];
  pagination_purchase_orders: IPagination;
  details_order_purchase: DetailOrderItems[];
  getPurchaseOrderDetail: (id: number) => Promise<void>;
  getPurchaseOrders: (
    startDate: string,
    endDate: string,
    page?: number,
    limit?: number,
    supplier?: string,
    state?: string
  ) => Promise<void>;
  postPurchaseOrder: (data: PurchaseOrderPayload) => Promise<void>;
  updateOrderProduct: (id: number, price: number | string, quantity: number | string) => void;
  updateIvaOrder: (id: number, iva: boolean) => void;
  deleteProductDetail: (id: number) => void;
  addProductToOrder: (product: BranchProduct) => void;
  deleteProductOrder: (id: number) => void;
  updateQuantityOrder: (id: number, quantity: number) => void;
  updatePriceOrder: (id: number, price: number) => void;
  clearProductOrder: () => void;
  updatePurchaseOrder: (id: number, details: UpdatePurchaseItems[]) => Promise<{ ok: boolean }>;
}
