import { IGetCustomerPagination, PayloadCustomer, Customer } from '../../types/customers.types';

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
    email: string,
    active: number,
    isTransmitter: number
  ) => void;
  postCustomer: (payload: PayloadCustomer) => Promise<boolean>;
  patchCustomer: (payload: PayloadCustomer, id: number) => void;
  getCustomersList: () => void;
  save_active_customer: (id: number) => void;
  deleteCustomer: (id: number) => Promise<boolean>;
}
