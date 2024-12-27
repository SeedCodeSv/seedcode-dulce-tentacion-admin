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