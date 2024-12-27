import { IPagination } from './global.types';

export interface TypeOfAccount {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface IGetTypeOfAccountPaginated extends IPagination {
  typeOfAccounts: TypeOfAccount[];
}

export interface ITypeOfAccountList {
  typeOfAccounts: TypeOfAccount[];
  ok: boolean;
}


export interface ITypeOfAccountPayload {
  name: string;
  description: string;
}