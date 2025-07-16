import { create } from 'zustand';
import { toast } from 'sonner';

import {
  activate_supplier,
  add_supplier,
  delete_supplier,
  get_supplier,
  get_supplier_by_id,
  get_supplier_pagination,
  update_supplier,
} from '../services/supplier.service';
import { messages } from '../utils/constants';

import { ISupplierStore } from './types/supplier_store.types';

import { Supplier } from '@/types/supplier.types';
import { initialPagination } from '@/utils/utils';

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
  loading: false,
  supplier_list: [],
  supplier_type: '',
  supplier: {} as Supplier,
  saveSupplierPagination: (supplier_pagination) => set({ supplier_pagination }),
  getSupplierPagination: (page, limit, name, email, nit, nrc, isTransmitter, active) => {
    set({ loading: true });
    get_supplier_pagination(page, limit, name, email, nit, nrc, isTransmitter, active)
      .then((supplier) => set({ supplier_pagination: supplier.data, loading: false }))
      .catch(() => {
        set({
          loading: false,
          supplier_pagination: {
            suppliers: [],
            ...initialPagination
          },
        });
      });
  },

  onPostSupplier: async (payload) => {
    return await add_supplier(payload)
      .then(({ data }) => {
        if (data) {
          get().getSupplierPagination(1, 5, '', '', '', '', '', 1);
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
          const supplier = get().supplier_type;

          get().getSupplierPagination(1, 5, '', '', '', '', supplier, 1);
          toast.success(messages.success);
        } else {
          toast.warning(messages.error);
        }
      })
      .catch(() => {
        toast.warning(messages.error);
      });
  },

  getSupplierList(name) {
    get_supplier(name)
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
        const supplier = get().supplier_type;

        get().getSupplierPagination(1, 5, '', '', '', '', supplier, 1);

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
        toast.success('Se activo el proveedor');
      })
      .catch(() => {
        toast.error('Error al activar el proveedor');
      });
  },
  OnGetBySupplier: (supplier) => {
    return get_supplier_by_id(supplier).then(({ data }) => {
      set({
        supplier: data.supplier,
      });
    });
  },
}));
