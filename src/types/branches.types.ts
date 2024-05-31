import { Product } from './products.types';
export interface Branches {
  id: number;
  name: string;
  address: string;
  phone: string;
  next: number;
  prev: number;
  isActive: boolean;
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
  price: number;
  branch: Branches;
  branchId: number;
  product: Product;
  productId: number;
  isActive: boolean;
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
