import { IGetSupplierPagination, PayloadSupplier, Supplier } from '../../types/supplier.types';

export interface ISupplierStore {
  supplier_pagination: IGetSupplierPagination;
  supplier_list: Supplier[];
  saveSupplierPagination: (supplier_pagination: IGetSupplierPagination) => void;
  getSupplierPagination: (
    page: number,
    limit: number,
    name: string,
    email: string,
    isTransmitter: number
  ) => void;
  onPostSupplier: (payload: PayloadSupplier) => Promise<boolean>;
  patchSupplier: (payload: PayloadSupplier, id: number) => void;
  getSupplierList: () => void;
  deleteSupplier: (id: number) => Promise<boolean>;
}
