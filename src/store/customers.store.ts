import { create } from 'zustand';
import { IUseCustomersStore } from './types/customers.store';
import {
  delete_customer,
  get_customers_pagination,
  save_customers,
  update_customers,
  get_customer,
<<<<<<< HEAD
} from '../services/customers.service';
import { toast } from 'sonner';
import { messages } from '../utils/constants';
=======
  activate_customer,
} from "../services/customers.service";
import { toast } from "sonner";
import { messages } from "../utils/constants";
import { AxiosError } from "axios";
>>>>>>> 3e9ce23de2f64f12d5138358f0466f6d7548609e

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
  customer_list: [],

<<<<<<< HEAD
  saveCustomersPagination: (customer_pagination) => set({ customer_pagination }),
  getCustomersPagination: (page, limit, name, email) => {
    get_customers_pagination(page, limit, name, email)
=======
  saveCustomersPagination: (customer_pagination) =>
    set({ customer_pagination }),
  getCustomersPagination: (
    page,
    limit,
    name,
    email,
    isActive,
    isTransmitter
  ) => {
    get_customers_pagination(page, limit, name, email, isActive, isTransmitter)
>>>>>>> 3e9ce23de2f64f12d5138358f0466f6d7548609e
      .then((customers) => set({ customer_pagination: customers.data }))
      .catch(() => {
        set({
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
  postCustomer: async (payload) => {
    return save_customers(payload)
      .then(({ data }) => {
        if (data) {
<<<<<<< HEAD
          get().getCustomersPagination(1, 5, '', '');
=======
          get().getCustomersPagination(1, 5, "", "", 1, 1);
>>>>>>> 3e9ce23de2f64f12d5138358f0466f6d7548609e
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
<<<<<<< HEAD
          get().getCustomersPagination(1, 5, '', '');
=======
          get().getCustomersPagination(1, 5, "", "", 1, 1);
>>>>>>> 3e9ce23de2f64f12d5138358f0466f6d7548609e
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
<<<<<<< HEAD
        get().getCustomersPagination(1, 5, '', '');
=======
        get().getCustomersPagination(1, 5, "", "", 1, 1);
>>>>>>> 3e9ce23de2f64f12d5138358f0466f6d7548609e
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);
        return false;
      });
<<<<<<< HEAD
=======
  },

  save_active_customer(id) {
    activate_customer(id).then(({ data }) => {
      if (data.ok) {
        get().getCustomersPagination(1, 5, "", "", 1, 1);
        toast.success(messages.success);
      } else {
        toast.warning(messages.error);
      }
    });
>>>>>>> 3e9ce23de2f64f12d5138358f0466f6d7548609e
  },
}));
