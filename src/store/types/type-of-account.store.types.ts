import { IPagination } from '@/types/global.types';
import { ITypeOfAccountPayload, TypeOfAccount } from '@/types/type-of-account.types';

export interface TypeOfAccountStore {
  type_of_account: TypeOfAccount[];
  loading: boolean;
  type_of_account_pagination: IPagination;
  list_type_of_account: TypeOfAccount[];
  searchParams: {
    name: string;
    limit: number;
    page: number;
  };
  getListTypeOfAccount: () => void;
  getTypeOfAccounts: (page: number, limit: number, name: string) => void;
  createTypeOfAccount: (payload: ITypeOfAccountPayload) => Promise<boolean>;
  updateTypeOfAccount: (payload: ITypeOfAccountPayload, id: number) => Promise<boolean>;
  deleteTypeOfAccount: (id: number) => Promise<boolean>;
  // getTypeOfAccount: (id: number) => Promise<TypeOfAccount>;
}
