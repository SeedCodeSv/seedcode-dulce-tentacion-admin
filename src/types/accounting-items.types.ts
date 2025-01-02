import { IPagination } from './global.types';

export interface AddItem {
  date: string;
  typeOfAccountId: number;
  concepOfTheItem: string;
  totalDebe: number;
  totalHaber: number;
  difference: number;
  itemDetails: ItemDetail[];
}

export interface ItemDetail {
  numberItem: string;
  catalog: string;
  branchId?: number;
  should: number;
  see: number;
}

export interface EditItem {
  date: string;
  typeOfAccountId: number;
  concepOfTheItem: string;
  totalDebe: number;
  totalHaber: number;
  difference: number;
  itemDetailsEdit: ItemDetailEdit[];
}

export interface ItemDetailEdit {
  id: number;
  numberItem: string;
  catalog: string;
  branchId?: number;
  should: number;
  see: number;
}

export interface TypeOfAccount {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Item {
  id: number;
  date: string;
  concepOfTheItem: string;
  totalDebe: string;
  totalHaber: string;
  difference: string;
  isActive: boolean;
  noPartida: number;
  typeOfAccount: TypeOfAccount;
  typeOfAccountId: number;
}

export interface GetAccountingItems extends IPagination {
  items: Item[];
}

export interface VerifyItemCount {
  ok: boolean;
  message: string;
  countItems: number;
  status: number;
}

export interface Details {
  id: number;
  numberItem: string;
  conceptOfTheTransaction: string;
  should: number;
  see: number;
  isActive: boolean;
  accountCatalog: {
    id: number;
    code: string;
    name: string;
    majorAccount: string;
    accountLevel: string;
    accountType: string;
    uploadAs: string;
    subAccount: boolean;
    item: string;
    isActive: boolean;
  };
  accountCatalogId: number;
  branchId: number;
  itemId: number;
}

export interface ItemDetails {
  id: number;
  noPartida: number;
  date: string;
  concepOfTheItem: string;
  totalDebe: number;
  totalHaber: number;
  difference: number;
  isActive: boolean;
  typeOfAccount: {
    id: number;
    name: string;
    description: string;
    IsActive: boolean;
  };
  typeOfAccountId: number;
  details: Details[];
}

export interface GetDetails {
  ok: boolean;
  item: ItemDetails;
  status: number;
}
