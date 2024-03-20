import {
  IGetCustomerPagination,
  PayloadCustomer,
} from "../../types/customers.types";

export interface IUseCustomersStore {
  customer_pagination: IGetCustomerPagination;
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
  deleteCustomer: (id: number) => Promise<boolean>;
}
