export interface IGetItemsDates {
  items: Item[];
  ok: boolean;
}

export interface Item {
  id: number;
  noPartida: number;
  date: string;
  concepOfTheItem: string;
  totalDebe: string;
  totalHaber: string;
  difference: string;
  isActive: boolean;
  correlative: string;
  typeOfAccountId: number;
  transmitterId: number;
  details: Detail[];
}

export interface Detail {
  id: number;
  numberItem: string;
  conceptOfTheTransaction: string;
  should: string;
  see: string;
  isActive: boolean;
  accountCatalog: AccountCatalog;
  accountCatalogId: number;
  branchId: number;
  itemId: number;
}

export interface AccountCatalog {
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
}

export interface GetItemsByMajor {
  majorAccounts: MajorAccount[];
  ok: boolean;
}

export interface MajorAccount {
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
  saldoAnterior: number;
  items: ItemMajor[];
}

export interface ItemMajor {
  day: string;
  totalDebe: string;
  totalHaber: string;
}

export interface GetItemsByDailyMajor {
  majorAccounts: MajorAccountDailyMajor[];
  ok: boolean;
}

export interface MajorAccountDailyMajor {
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
  items: ItemDailyMajor[];
  saldoAnterior: number;
}

export interface ItemDailyMajor {
  conceptOfTheTransaction: string;
  should: string;
  see: string;
  item: ItemDailyMajor;
  accountCatalog: AccountCatalogDailyMajor;
}

export interface ItemDailyMajor {
  noPartida: number;
  date: string;
}

export interface AccountCatalogDailyMajor {
  code: string;
  name: string;
}

export interface GetMajorAccounts{
  ok: boolean,
  majorAccounts: MajorAccount[]
}