import { IGetSupplierPagination, PayloadSupplier, Supplier } from '../../types/supplier.types';

export interface ISupplierStore {
  supplier_pagination: IGetSupplierPagination;
  supplier_list: Supplier[];
  supplier_type: string;
  loading: boolean;
  saveSupplierPagination: (supplier_pagination: IGetSupplierPagination) => void;
  getSupplierPagination: (
    page: number,
    limit: number,
    name: string,
    email: string,
    nit: string,
    nrc: string,
    isTransmitter: number | string,
    active?: number
  ) => void;
  supplier: Supplier;
  OnGetBySupplier: (id: number) => void;
  onPostSupplier: (payload: PayloadSupplier) => Promise<boolean>;
  patchSupplier: (payload: Supplier, id: number) => void;
  getSupplierList: (nombre: string) => void;
  deleteSupplier: (id: number) => Promise<boolean>;
  activateSupplier: (id: number) => Promise<void>;
}
