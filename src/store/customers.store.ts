import { create } from 'zustand';
import { IUseCustomersStore } from './types/customers.store';
import {
  get_customers_pagination,
  save_customers,
  update_customers,
  get_customer,
  activate_customer,
  delete_customer,
  getCustomerById,
} from '../services/customers.service';
import { toast } from 'sonner';
import { messages } from '../utils/constants';

export const useCustomerStore = create<IUseCustomersStore>((set, get) => ({
  customer_pagination: {
    customers: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  loading_customer: false,
  customer_list: [],
  user_by_id: null,
  saveCustomersPagination: (customer_pagination) => set({ customer_pagination }),
  getCustomersPagination: (page, limit, name, email, branchName, isTransmitter, isActive = 1) => {
    set({ loading_customer: true });
    get_customers_pagination(page, limit, name, email, branchName, isTransmitter, isActive)
      .then((customers) => set({ customer_pagination: customers.data, loading_customer: false }))
      .catch(() => {
        set({
          loading_customer: false,
          customer_pagination: {
            customers: [],
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
  postCustomer: (payload) => {
    return save_customers(payload)
      .then(({ data }) => {
        if (data) {
          get().getCustomersPagination(1, 5, '', '', '', '');
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
  patchCustomer: (payload, id) => {
    update_customers(payload, id)
      .then(({ data }) => {
        if (data) {
          get().getCustomersPagination(1, 5, '', '', '', '');
          toast.success(messages.success);
        } else {
          toast.warning(messages.error);
        }
      })
      .catch(() => {
        toast.warning(messages.error);
      });
  },
  getCustomersList() {
    get_customer()
      .then(({ data }) => {
        set((state) => ({ ...state, customer_list: data.customers }));
      })
      .catch(() => {
        set((state) => ({ ...state, customer_list: [] }));
      });
  },
  deleteCustomer: async (id) => {
    return await delete_customer(id)
      .then(({ data }) => {
        get().getCustomersPagination(1, 5, '', '', '', '');
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);
        return false;
      });
  },

  // save_active_customer(id) {
  //   activate_customer(id).then(({ data }) => {
  //     if (data.ok) {
  //       toast.success(messages.success);
  //     } else {
  //       toast.warning(messages.error);
  //     }
  //   });
  // },

  save_active_customer(id) {
    return activate_customer(id)
      .then(() => {
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },

  get_customer_by_id: (id: number) => {
  
    getCustomerById(id)  
      .then(({ data }) => {
        set({ user_by_id: data }); 
      })
      .catch(() => {
        set({ user_by_id: null });
      });
  },
}));
