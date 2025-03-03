import { Item } from '@/types/items.types';

export interface IItemsState {
  items: Item[];
  loadingItems: boolean;
  getItemsByDates: (transId: number, startDate: string, endDate: string) => Promise<Item[]>;
}
