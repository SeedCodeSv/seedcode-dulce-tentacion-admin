import { create } from 'zustand';
import { ISupplierStore } from './types/supplier_store.types';
import {
  activate_supplier,
  add_supplier,
  delete_supplier,
  get_supplier,
  get_supplier_pagination,
  update_supplier,
} from '../services/supplier.service';
import { toast } from 'sonner';
import { messages } from '../utils/constants';

export const useSupplierStore = create<ISupplierStore>((set, get) => ({
  supplier_pagination: {
    suppliers: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  supplier_list: [],

  saveSupplierPagination: (supplier_pagination) => set({ supplier_pagination }),
  getSupplierPagination: (page, limit, name, email, isTransmitter, active) => {
    get_supplier_pagination(page, limit, name, email, isTransmitter, active)
      .then((supplier) => set({ supplier_pagination: supplier.data }))
      .catch(() => {
        set({
          supplier_pagination: {
            suppliers: [],
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 404,
            ok: false,
          },
        });
      });
  },

  onPostSupplier: async (payload) => {
    return await add_supplier(payload)
      .then(({ data }) => {
        if (data) {
          get().getSupplierPagination(1, 5, '', '', 1);
          toast.success(messages.success);
          return true;
        } else {
          toast.warning(messages.error);
          return false;
        }
      })
      .catch(() => {
        toast.warning(messages.error);
        return false;
      });
  },

  patchSupplier: (payload, id) => {
    update_supplier(payload, id)
      .then(({ data }) => {
        if (data) {
          get().getSupplierPagination(1, 5, '', '', 1);
          toast.success(messages.success);
        } else {
          toast.warning(messages.error);
        }
      })
      .catch(() => {
        toast.warning(messages.error);
      });
  },

  getSupplierList() {
    get_supplier()
      .then(({ data }) => {
        set((state) => ({ ...state, supplier_list: data.suppliers }));
      })
      .catch(() => {
        set((state) => ({ ...state, supplier_list: [] }));
      });
  },

  deleteSupplier: async (id) => {
    return await delete_supplier(id)
      .then(({ data }) => {
        get().getSupplierPagination(1, 5, '', '', 1);
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);
        return false;
      });
  },
  activateSupplier(id) {
    return activate_supplier(id)
      .then(() => {
        toast.success('Se activo la categoría');
      })
      .catch(() => {
        toast.error('Error al activar la categoría');
      });
  },
}));
