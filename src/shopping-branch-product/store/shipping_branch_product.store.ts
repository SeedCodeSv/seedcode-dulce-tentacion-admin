import { create } from 'zustand';
import { toast } from 'sonner';

import { BranchProduct, IResponseBranchProductPaginatedSent, IShippingProductBranchStore } from '../types/shipping_branch_product.types';
import { get_shopping_products_branch } from '../service/shipping_branch_product.service';

import { Branches } from '@/types/branches.types';
import { verify_products_stock } from '@/services/branch_product.service';
export const useShippingBranchProductBranch = create<IShippingProductBranchStore>((set, get) => ({
  orderId: 0,
  branchProducts: [],
  pagination_shippin_product_branch: {} as IResponseBranchProductPaginatedSent,
  branchDestiny: {} as Branches,
  response: {
    results: [],
    ok: false
  },
  OnGetShippinProductBranch(
    branchId: number,
    page: number,
    limit: number,
    name: string,
    category: string,
    supplier: string,
    code: string
  ) {
    get_shopping_products_branch(branchId, page, limit, name, category, supplier, code).then(
      (res) => {
        if (!res.data.ok) return set({
          branchProducts: [],
          pagination_shippin_product_branch: {} as IResponseBranchProductPaginatedSent,
        });

        set({
          branchProducts: res.data.branchProducts,
          pagination_shippin_product_branch: {
            total: res.data.total,
            totalPag: res.data.totalPag,
            currentPag: res.data.currentPag,
            nextPag: res.data.nextPag,
            prevPag: res.data.prevPag,
          },
        });
      }
    ).catch(() => set({
      branchProducts: [],
      pagination_shippin_product_branch: {} as IResponseBranchProductPaginatedSent,
    }));
  },
  product_selected: [],
  OnAddProductSelected(product) {
    try {
      const existingProduct = get().product_selected.find((p) => p.id === product.id);

      if (existingProduct) {
        set({
          product_selected: get().product_selected.map((p) => {
            if (p.id === product.id) {
              return { ...p, quantity: p.quantity! + 1 };
            }

            return p;
          }),
        });
      } else {
        const productWithStock = { ...product, quantity: 1 };

        set({
          product_selected: [...get().product_selected, productWithStock],
        });
      }
    } catch (error) {
      set({
        product_selected: [],
      });
      toast.error('Error al agregar o actualizar el producto');
    }
  },
  OnPlusProductSelected(productId) {
    try {
      set({
        product_selected: get().product_selected.map((product) => {
          if (product.id === productId) {
            return { ...product, quantity: product.quantity! + 1 };
          }

          return product;
        }),
      });
    } catch (error) {
      set({
        product_selected: [],
      });
      toast.error('Error al agregar el producto');
    }
  },
  OnMinusProductSelected(productId) {
    try {
      set({
        product_selected: get().product_selected.map((product) => {
          if (product.id === productId) {
            return { ...product, quantity: product.quantity! - 1 };
          }

          return product;
        }),
      });
    } catch (error) {
      set({
        product_selected: [],
      });
      toast.error('Error al agregar el producto');
    }
  },
  OnClearProductSelected(productId) {
    try {
      set({
        product_selected: get().product_selected.filter((product) => product.id !== productId),
      });
      toast.success('Producto eliminado');
    } catch (error) {
      set({
        product_selected: [],
      });
      toast.error('Error al eliminar el producto');
    }
  },
  OnClearProductSelectedAll() {
    try {
      set({
        product_selected: [],
        branchDestiny: {} as Branches
      });
    } catch (error) {
      set({
        product_selected: [],
        branchDestiny: {} as Branches
      });
    }
  },
  OnChangeQuantityManual(branchProductId,prdId, quantity) {
    const { response } = get()
    const updatedProducts = response.results.map((cp) =>
      cp.productId === prdId ? { ...cp, required: quantity, status: quantity > Number(cp.stock)? 'insufficient_stock': 'ok'  } : cp
    )

    set({ response: { ...response, results: updatedProducts } });


    set((state) => ({
      product_selected: state.product_selected.map((cp) =>
        cp.id === branchProductId ? { ...cp, total: Number(cp.price) * quantity, quantity } : cp
      ),
    }));
  },
  OnUpdatePriceManual(productId, price) {
    set((state) => ({
      product_selected: state.product_selected.map((cp) =>
        cp.id === productId ? { ...cp, total: Number(price) * Number(cp.quantity), price } : cp
      ),
    }));
  },
  OnUpdateCosteManual(productId, costoUnitario) {
    set((state) => ({
      product_selected: state.product_selected.map((cp) =>
        cp.id === productId ? { ...cp, total: Number(costoUnitario) * Number(cp.quantity), costoUnitario } : cp
      ),
    }));
  },
  OnClearDataShippingProductBranch() {
    set({
      branchProducts: [],
      pagination_shippin_product_branch: {} as IResponseBranchProductPaginatedSent,
    });
  },
  onAddBydetail(details) {
    get().OnClearDataShippingProductBranch()
    get().OnClearProductSelectedAll()
    const products = [] as BranchProduct[]

    for (const detail of details) {
      const branchProduct = detail.branchProduct
      const pendingQuantity = Number(detail.pendingQuantity)

      if (detail.completedRequest === false)
        products.push({
          ...branchProduct,
          quantity: pendingQuantity
        })
    }

    set({ product_selected: products })
  },
  onAddBranchDestiny(branch) {
    set({ branchDestiny: branch })
  },
  onAddOrderId(id) {
    set({ orderId: id })
  },
  async onVerifyStockProducts(id, products) {
    await verify_products_stock(id, products).then(({ data }) => {
      set({ response: data })
    }).catch(() => {
      set({
        response: {
          results: [],
          ok: false
        },
      })
    })
  },
  setResponse(data) {
    set({ response: data })
  }
}));
