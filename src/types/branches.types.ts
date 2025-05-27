import { Transmitter } from './categories.types';
import { Product } from './products.types';
export interface Branches {
  id: number;
  name: string;
  address: string;
  phone: string;
  codEstable: string;
  codEstableMH: string;
  tipoEstablecimiento: string;
  isActive: boolean;
  transmitter?: Transmitter
}

export interface IGetBranchesPaginated {
  branches: Branches[];
  ok: boolean;
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface IBranchForm {
  name: string;
  phone: string;
  address: string;
  codEstable: string;
  codEstableMH: string;
  tipoEstablecimiento: string;
}

export interface IBranchPayload extends IBranchForm {
  transmitterId: number;
}

export interface IGetBranchesList {
  ok: boolean;
  message: string;
  branches: Branches[];
  status: number;
}
export interface IGetBranchProduct {
  id: number;
  stock: number;
  reserved: number;
  price: number;
  branch: Branches;
  branchId: number;
  product: Product;
  productId: number;
  isActive: boolean;
  hasActiveMenu: boolean
}
export interface IGetBranchProductList {
  branchProducts: IGetBranchProduct[];
  ok: boolean;
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface GetBranchResponse {
  ok: boolean;
  message: string;
  branch: Branches;
  status: number;
}


