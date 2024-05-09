import { create } from "zustand";
import { IUseCustomersStore } from "./types/customers.store";
import {
  delete_customer,
  get_customers_pagination,
  save_customers,
  update_customers,
} from "../services/customers.service";
import { toast } from "sonner";
import { messages } from "../utils/constants";
import { AxiosError } from "axios";

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
  saveCustomersPagination: (customer_pagination) =>
    set({ customer_pagination }),
  getCustomersPagination: (page, limit, name, email) => {
    get_customers_pagination(page, limit, name, email)
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
          get().getCustomersPagination(1, 5, "", "");
          toast.success(messages.success);
          return true;
        } else {
          toast.warning(messages.error);
          return false;
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
        toast.warning(messages.error);
        return false;
      });
  },
  patchCustomer: (payload, id) => {
    update_customers(payload, id)
      .then(({ data }) => {
        if (data) {
          get().getCustomersPagination(1, 5, "", "");
          toast.success(messages.success);
        } else {
          toast.warning(messages.error);
        }
      })
      .catch(() => {
        toast.warning(messages.error);
      });
  },
  deleteCustomer: async (id) => {
    return await delete_customer(id).then(({ data }) => {
      get().getCustomersPagination(1, 5, "", "");
      toast.success(messages.success);
      return data.ok;
    }).catch(()=>{
      toast.warning(messages.error);
      return false
    })
  },
}));
