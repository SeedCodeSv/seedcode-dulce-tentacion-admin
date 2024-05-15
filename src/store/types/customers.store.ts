import {
  IGetCustomerPagination,
  PayloadCustomer,
  Customer
} from "../../types/customers.types";

export interface IUseCustomersStore {
  customer_pagination: IGetCustomerPagination;
  customer_list: Customer[];
  saveCustomersPagination: (
    customer_pagination: IGetCustomerPagination
  ) => void;
  getCustomersPagination: (
    page: number,
    limit: number,
    name: string,
    email: string
  ) => void;
  postCustomer: (payload: PayloadCustomer) => Promise<boolean>;
  patchCustomer: (payload: PayloadCustomer, id: number) => void;
  getCustomersList: () => void;
  deleteCustomer: (id: number) => Promise<boolean>;
}
