import { create } from 'zustand';
import { PurchaseOrderStore } from './types/purchase_orders.types';
import {
  get_details_purchase_order,
  get_order_purchase,
  save_order_purchase,
  update_order,
} from '../services/purchase_orders.service';
import { toast } from 'sonner';

export const usePurchaseOrdersStore = create<PurchaseOrderStore>((set, get) => ({
  purchase_orders: [],
  pagination_purchase_orders: {
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 0,
    ok: false,
  },
  details_order_purchase: [],
  async getPurchaseOrderDetail(id) {
    await get_details_purchase_order(id)
      .then((res) => {
        set({
          details_order_purchase: res.data.detailPurchaseOrders.map((detail) => ({
            price: detail.cost,
            name: detail.branchProduct.product.name,
            quantity: detail.quantity,
            orderId: detail.id,
            total: Number(detail.cost) * Number(detail.quantity),
            isNew: false,
            productId: detail.branchProduct.id,
            iva: true,
          })),
        });
      })
      .catch(() => {
        set({ details_order_purchase: [] });
      });
  },
  async postPurchaseOrder(data) {
    await save_order_purchase(data)
      .then(() => {
        toast.success('Orden de compra guardada correctamente');
      })
      .catch(() => {
        toast.error('Error al guardar la orden');
      });
  },
  async getPurchaseOrders(startDate, endDate, page, limit, supplier, state = '') {
    await get_order_purchase(startDate, endDate, page, limit, supplier, state)
      .then((res) => {
        set({ purchase_orders: res.data.purchaseOrders });
        set({
          pagination_purchase_orders: {
            total: res.data.total,
            totalPag: res.data.totalPag,
            currentPag: res.data.currentPag,
            nextPag: res.data.nextPag,
            prevPag: res.data.prevPag,
            status: res.data.status,
            ok: res.data.ok,
          },
        });
      })
      .catch(() => {
        set({ purchase_orders: [] });
        set({
          pagination_purchase_orders: {
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 0,
            ok: false,
          },
        });
      });
  },
  updateOrderProduct(id, price, quantity) {
    const product = get().details_order_purchase.find((cp) => cp.orderId === id);
    if (product) {
      set({
        details_order_purchase: get().details_order_purchase.map((cp) =>
          cp.orderId === id
            ? {
                ...cp,
                ...(typeof price === 'number' ? { price } : {}),
                ...(typeof quantity === 'number' ? { quantity } : {}),
                total:
                  typeof price === 'number'
                    ? Number(price) * Number(cp.quantity)
                    : typeof quantity === 'number'
                      ? Number(quantity) * Number(cp.price)
                      : cp.total,
              }
            : cp
        ),
      });
    }
  },
  deleteProductDetail() {},
  addProductToOrder(product) {
    const exist = get().details_order_purchase.find((cp) => cp.productId === product.id);
    if (!exist) {
      set({
        details_order_purchase: [
          ...get().details_order_purchase,
          {
            name: product.product.name,
            price: Number(product.price),
            quantity: 1,
            orderId: 0,
            total: Number(product.price),
            isNew: true,
            productId: product.id,
            iva: true,
          },
        ],
      });
    } else {
      toast.error('Ya existe este producto');
    }
  },
  deleteProductOrder(id) {
    const find = get().details_order_purchase.find((cp) => cp.orderId === id);
    if (find) {
      const products = get().details_order_purchase.filter((cp) => cp.productId !== id);
      set({ details_order_purchase: products });
    }
  },
  updatePriceOrder(id, price) {
    const product = get().details_order_purchase.find((cp) => cp.productId === id);
    if (product) {
      set({
        details_order_purchase: get().details_order_purchase.map((cp) =>
          cp.productId === id
            ? { ...cp, price, cost: price * cp.quantity, total: price * cp.quantity }
            : cp
        ),
      });
    }
  },
  updateQuantityOrder(id, quantity) {
    const product = get().details_order_purchase.find((cp) => cp.productId === id);

    if (product) {
      set({
        details_order_purchase: get().details_order_purchase.map((cp) =>
          cp.productId === id
            ? { ...cp, quantity, cost: cp.price * quantity, total: cp.price * quantity }
            : cp
        ),
      });
    }
  },
  clearProductOrder() {
    const oldest_products = get().details_order_purchase.filter((cp) => !cp.isNew);
    set({ details_order_purchase: oldest_products });
  },
  updatePurchaseOrder(id, details) {
    update_order(id, details)
      .then(() => {
        toast.success('Orden de compra actualizada correctamente');
      })
      .catch(() => {
        toast.error('Error al actualizar la orden');
      });
  },
  updateIvaOrder(id, iva) {
    set({
      details_order_purchase: get().details_order_purchase.map((cp) =>
        cp.orderId === id ? { ...cp, iva } : cp
      ),
    });
  },
}));
