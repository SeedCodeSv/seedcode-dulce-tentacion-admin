import { IGetCustomerPagination, PayloadCustomer, Customer, IGetCustomerById } from '../../types/customers.types';
export interface IUseCustomersStore {
  loading: boolean;
  customer_pagination: IGetCustomerPagination;
  customer_list: Customer[];
  user_by_id: IGetCustomerById;
  loading_customer: boolean;
  customer: Customer | undefined;
  loading_save: boolean;
  customer_type: string;
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
  // patchCustomer: (payload: PayloadCustomer, id: number) => void;
  patchCustomer: (payload: PayloadCustomer, id: number) => Promise<boolean>;
  getCustomersList: () => void;
  save_active_customer: (id: number) => Promise<void>;
  get_customer_by_id: (id: number) => Promise<IGetCustomerById | undefined>;
  deleteCustomer: (id: number) => Promise<boolean>;
  getCustomerById: (id: number) => void;
  getCustomerByBranchId: () => void;
}
