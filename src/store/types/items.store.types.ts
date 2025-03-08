import { Item, MajorAccount } from '@/types/items.types';

export interface IItemsState {
  items: Item[];
  loadingItems: boolean;
  majorItems: MajorAccount[];
  loadingMajorAccount: boolean;
  getItemsByMajor: (transId: number, startDate: string, endDate: string) => Promise<MajorAccount[]>;
  getItemsByDates: (transId: number, startDate: string, endDate: string) => Promise<Item[]>;
}
