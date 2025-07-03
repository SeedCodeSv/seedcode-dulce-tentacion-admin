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
          product_selected: get().product_selected.map((p) =>
            p.id === product.id ? { ...p, quantity: (p.quantity ?? 0) + 1 } : p
          ),
        });
      } else {
        if (Number(product.stock) <= 0) {
          toast.error('Este producto no tiene suficiente stock');

          return;
        }

        const productWithQuantity = { ...product, quantity: 0 };

        set({
          product_selected: [...get().product_selected, productWithQuantity],
        });
      }
    } catch (error) {
      set({ product_selected: [] });
      toast.error('Error al agregar o actualizar el producto');
    }
  },

  OnPlusProductSelected(branchProductId, stock) {
    try {
      const { product_selected, response } = get();

      // Actualizamos la lista de productos seleccionados
      const updatedProductSelected = product_selected.map((product) => {
        if (product.id === branchProductId) {
          const newQuantity = (product.quantity ?? 0) + 1;

          if (newQuantity > stock) {
            toast.error('Cantidad supera el stock disponible');

            return product;
          }

          return {
            ...product,
            quantity: newQuantity,
            total: Number(product.price) * newQuantity,
          };
        }

        return product;
      });

      // Actualizamos la lista de resultados
      const updatedResults = response.results.map((item) => {
        const selected = updatedProductSelected.find((p) => p.id === branchProductId);

        if (!selected) return item;

        if (item.productId === selected.product.id) {
          const required = selected.quantity ?? 0;

          return {
            ...item,
            required,
            status: required > Number(item.stock) ? 'insufficient_stock' : 'ok',
          };
        }

        return item;
      });

      set({
        product_selected: updatedProductSelected,
        response: {
          ...response,
          results: updatedResults,
        },
      });
    } catch (error) {
      set({ product_selected: [] });
      toast.error('Error al agregar el producto');
    }
  },
  OnMinusProductSelected(branchProductId) {
    try {
      const { product_selected, response } = get();

      const updatedProductSelected = product_selected.map((product) => {
        if (product.id === branchProductId) {
          const newQuantity = Math.max((product.quantity ?? 0) - 1, 0);

          return {
            ...product,
            quantity: newQuantity,
            total: Number(product.price) * newQuantity,
          };
        }

        return product;
      });

      const updatedResults = response.results.map((item) => {
        const selected = updatedProductSelected.find((p) => p.id === branchProductId);

        if (!selected) return item;

        if (item.productId === selected.product.id) {
          const required = selected.quantity ?? 0;

          return {
            ...item,
            required,
            status: required > Number(item.stock) ? 'insufficient_stock' : 'ok',
          };
        }

        return item;
      });

      set({
        product_selected: updatedProductSelected,
        response: {
          ...response,
          results: updatedResults,
        },
      });
    } catch (error) {
      set({ product_selected: [] });
      toast.error('Error al restar el producto');
    }
  },
  OnClearProductSelected(branchProductId) {
    try {
      const { product_selected, response } = get();

      // Buscar el producto antes de eliminarlo
      const productToRemove = product_selected.find(p => p.id === branchProductId);

      // Primero actualizamos response.results
      const updatedResults = response.results.map((item) => {
        if (item.productId === productToRemove?.product.id) {
          return {
            ...item,
            required: 0,
            status: 'ok',
          };
        }

        return item;
      });

      // Luego eliminamos el producto del listado seleccionado
      const updatedProductSelected = product_selected.filter(
        (product) => product.id !== branchProductId
      );

      // Aplicamos el nuevo estado
      set({
        product_selected: updatedProductSelected,
        response: {
          ...response,
          results: updatedResults,
        },
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
  OnChangeQuantityManual(branchProductId, prdId, stock, quantity) {
    if (quantity > stock) {
      toast.error('No tienes stock suficiente');
    }

    const clampedQuantity = Math.max(0, Math.min(quantity, stock));
    const { response } = get();

    const updatedProducts = response.results.map((cp) =>
      cp.productId === prdId
        ? {
          ...cp,
          required: clampedQuantity,
          status: clampedQuantity > Number(cp.stock) ? 'insufficient_stock' : 'ok',
        }
        : cp
    );



    set({ response: { ...response, results: updatedProducts } });
    // const value = this.product_selected.find((br) => br.id === branchProductId && br) ?? {} as any

    set((state) => ({
      product_selected: state.product_selected.map((cp) =>
        cp.id === branchProductId
          ? {
            ...cp,
            total: Number(cp.price) * clampedQuantity,
            quantity: clampedQuantity,
          }
          : cp
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
          quantity: pendingQuantity,
          stock: 'sin definir'
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
    const { product_selected } = get();

    const updatedProducts = product_selected.map((item) => {
      const match = data.results.find((r) => r.productId === item.product.id);

      if (match && match.stock !== undefined) {
        return {
          ...item,
          stock: Number(match.stock),
        };
      }
      if(match){
         return {
          ...item,
          stock: 'sin definir',
        };
      }

      return item;
    });

    set({
      response: data,
      product_selected: updatedProducts,
    });
  }

}));
