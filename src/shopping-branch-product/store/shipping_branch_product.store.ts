import { create } from 'zustand';
import { toast } from 'sonner';

import { BranchProduct, IResponseBranchProductPaginatedSent, IShippingProductBranchStore } from '../types/shipping_branch_product.types';
import { get_shopping_products_branch } from '../service/shipping_branch_product.service';
export const useShippingBranchProductBranch = create<IShippingProductBranchStore>((set, get) => ({
  branchProducts: [],
  pagination_shippin_product_branch: {} as IResponseBranchProductPaginatedSent,
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
      });
    } catch (error) {
      set({
        product_selected: [],
      });
    }
  },
  OnChangeQuantityManual(productId, quantity) {
    set((state) => ({
      product_selected: state.product_selected.map((cp) =>
        cp.id === productId ? { ...cp, total: Number(cp.price) * quantity, quantity } : cp
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

    const products = [] as BranchProduct[]

    for (const detail of details) {
      const branchProduct = detail.branchProduct

      products.push({...branchProduct,
        quantity: Number(detail.quantity)
      })
    }

    set({ product_selected: products })
  },
}));
