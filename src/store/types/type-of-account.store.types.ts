import { IPagination } from '@/types/global.types';
import { TypeOfAccount } from '@/types/type-of-account.types';

export interface TypeOfAccountStore {
  type_of_account: TypeOfAccount[];
  loading: boolean;
  type_of_account_pagination: IPagination;
  getTypeOfAccounts: (page: number, limit: number, name: string) => void;
}
