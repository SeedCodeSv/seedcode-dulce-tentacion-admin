import { IGetUserById } from '@/types/user_by_id.types';
import { IGetCustomerPagination, PayloadCustomer, Customer } from '../../types/customers.types';

export interface IUseCustomersStore {
  customer_pagination: IGetCustomerPagination;
  customer_list: Customer[];
  user_by_id: IGetUserById | null;
  loading_customer: boolean;
  saveCustomersPagination: (customer_pagination: IGetCustomerPagination) => void;
  getCustomersPagination: (
    page: number,
    limit: number,
    name: string,
    email: string,
    branchName: string,
    isTransmitter: number | string,
    active?: number
  ) => void;
  postCustomer: (payload: PayloadCustomer) => Promise<boolean>;
  patchCustomer: (payload: PayloadCustomer, id: number) => void;
  getCustomersList: () => void;
  save_active_customer: (id: number) => Promise<void>;
  get_customer_by_id: (id: number) => Promise<IGetUserById | undefined>;
  deleteCustomer: (id: number) => Promise<boolean>;
}
