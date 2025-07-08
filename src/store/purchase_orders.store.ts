import { create } from 'zustand';
import { toast } from 'sonner';

import {
  add_product_order,
  delete_order_item,
  get_details_purchase_order,
  get_order_purchase,
  save_order_purchase,
  update_order,
} from '../services/purchase_orders.service';

import { PurchaseOrderStore } from './types/purchase_orders.types';

import { PurchaseOrder } from '@/types/purchase_orders.types';
import { BranchProduct } from '@/types/branch_products.types';
import { generateUniqueId } from '@/utils/utils';

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
  loading_complete: false,
  pagination_purchase_orders_loading: false,
  details_order_purchase: [],
  prchase_product_add: [],
  async getPurchaseOrderDetail(id) {
    set({ details_order_purchase: [] });
    await get_details_purchase_order(id)
      .then((res) => {
        set({
          details_order_purchase: res.data.detailPurchaseOrders.map((detail) => ({
            id: detail.id,
            numItem: generateUniqueId(),
            sellingPrice: detail.sellingPrice,
            isActive: detail.isActive,
            subtractedProduct: detail.subtractedProduct,
            purchaseOrder: detail.purchaseOrder,
            branchProduct: detail.branchProduct,
            priceFixed: Number(detail.branchProduct.price),
            price: Number(detail.branchProduct.price),
            stock: Number(detail.branchProduct.stock),
            cost: detail.cost,
            priceA: detail.branchProduct.priceA,
            priceB: detail.branchProduct.priceB,
            priceC: detail.branchProduct.priceC,
            name: detail.branchProduct.product.name,
            quantity: detail.quantity,
            orderId: detail.id,
            total: Number(detail.cost) * Number(detail.quantity),
            isNew: false,
            branchProductId: detail.branchProduct.id,
            iva: false,
            profit: 0,
            purchaseOrderId: detail.purchaseOrder.id,
            supplier: detail.supplier,
            supplierId: detail.supplierId
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
    const product = get().details_order_purchase.find((cp) => cp.id === id);

    if (product) {
      set({
        details_order_purchase: get().details_order_purchase.map((cp) =>
          cp.id === id
            ? {
              ...cp,
              ...(typeof price === 'number' ? { price } : {}),
              ...(typeof quantity === 'number' ? { quantity } : {}),
              total:
                typeof price === 'number'
                  ? Number(price) * Number(cp.quantity)
                  : typeof quantity === 'number'
                    ? Number(quantity) * Number(cp.branchProduct.price)
                    : Number(cp.branchProduct.price) * cp.quantity,
            }
            : cp
        ),
      });
    }
  },
  deleteProductDetail(item) {
    delete_order_item(item?.id as number).then(() => {
      toast.success('Eliminado correctamente');
      set({
        details_order_purchase: get().details_order_purchase.filter((cp) => cp !== item),
      });
    });
  },
  addProductToOrder(product) {
    const exist = get().details_order_purchase.find(
      (cp) => cp.branchProductId === product.id
    );

    if (!exist) {
      set({
        details_order_purchase: [
          ...get().details_order_purchase,
          {
            name: product.product.name,
            cost: Number(product.costoUnitario),
            quantity: 1,
            purchaseOrderId: 0,
            branchProductId: product.id,
            iva: false,
            id: 0,
            sellingPrice: '',
            subtractedProduct: '',
            isActive: false,
            purchaseOrder: undefined as unknown as PurchaseOrder,
            branchProduct: undefined as unknown as BranchProduct,
          },
        ],
      });
    } else {
      toast.error('Ya existe este producto');
    }
  },
  deleteProductOrder(id) {
    const find = get().details_order_purchase.find((cp) => cp.purchaseOrderId === id);

    if (find) {
      const products = get().details_order_purchase.filter((cp) => cp.branchProductId !== id);

      set({ details_order_purchase: products });
    }
  },
  updatePriceOrder(id, price) {
    const product = get().details_order_purchase.find((cp) => cp.branchProductId === id);

    if (product) {
      set({
        details_order_purchase: get().details_order_purchase.map((cp) =>
          cp.branchProductId === id
            ? {
              ...cp,
              price,
              cost: price * cp.quantity,
              total: price * cp.quantity,
            }
            : cp
        ),
      });
    }
  },
  updateQuantityOrder(numItem, quantity) {
    const product = get().details_order_purchase.find((cp) => cp.numItem === numItem);

    if (product) {
      set({
        details_order_purchase: get().details_order_purchase.map((cp) =>
          cp.numItem === numItem
            ? {
              ...cp,
              quantity,
              cost: Number(cp.branchProduct.price) * quantity,
              total: Number(cp.branchProduct.price) * quantity,
            }
            : cp
        ),
      });
    }
  },
  clearProductOrder() {
    const oldest_products = get().details_order_purchase.filter((cp) => !cp.isNew);

    set({ details_order_purchase: oldest_products });
  },
  updatePurchaseOrder(id, details): Promise<{ ok: boolean }> {
    return update_order(id, details)
      .then(() => {
        toast.success('Orden de compra actualizada correctamente');

        return { ok: true };
      })
      .catch(() => {
        toast.error('Error al actualizar la orden');

        return { ok: false };
      });
  },
  updateIvaOrder(id, iva) {
    set({
      details_order_purchase: get().details_order_purchase.map((cp) =>
        cp.purchaseOrderId === id ? { ...cp, iva } : cp
      ),
    });
  },
  updateCostOrder(id, cost) {
    const product = get().details_order_purchase.find((cp) => cp.branchProductId === id);

    if (product) {
      set({
        details_order_purchase: get().details_order_purchase.map((cp) =>
          cp.branchProductId === id
            ? {
              ...cp,
              cost: Number(cost),
              cost1: Number(cp.branchProduct?.price) * cp.quantity,
              branchProduct: {
                ...cp.branchProduct,
                costoUnitario: cost.toString(),
              },
              // costoUnitario: Number(cost),
              total: Number(cp.branchProduct?.price) * cp.quantity * cp.quantity,
            }
            : cp
        ),
      });
    }
  },
  removeProductsFromPrchaseProductAdd() {
    const prchase_product_add = get().prchase_product_add;
    const details_order_purchase = get().details_order_purchase;

    prchase_product_add.splice(0, prchase_product_add.length);
    details_order_purchase.splice(0, details_order_purchase.length);
  },
  removeProductFromPrchaseProductAdd(numItem) {

    set((state) => ({
      details_order_purchase: state.details_order_purchase.filter((item) => item.numItem !== numItem)
    }))
  },
  async OnAddProductOrder(purchaseId, data): Promise<{ ok: boolean }> {
    try {
      if (data.stock! <= 0) {
        toast.error('Stock insuficiente');

        return { ok: false };
      }
      await add_product_order(purchaseId, data);
      toast.success('Producto agregado al pedido con éxito');

      return { ok: true };
    } catch (error) {
      toast.error('Error al agregar el producto');

      return { ok: false };
    }
  },
  onUpdateSupplier(numItem, supplier) {
    set((state) => ({
      details_order_purchase: state.details_order_purchase.map((cp) =>
        cp.numItem === numItem && cp.isNew ? { ...cp, supplier, supplierId: Number(supplier.id) } : cp
      ),
    }));
  },
  duplicateProduct(item) {
    const { details_order_purchase } = get();

    set({
      details_order_purchase: [
        ...details_order_purchase,
        {
          ...item, isNew: true,
          numItem: generateUniqueId(),
        }
      ]
    });
  },
}));
