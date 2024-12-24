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
