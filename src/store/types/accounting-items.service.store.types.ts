import { AddItem, Item } from '@/types/accounting-items.types';
import { IPagination } from '@/types/global.types';

export interface AccountingItemsServiceStore {
  accounting_items: Item[];
  loading: boolean;
  accounting_items_pagination: IPagination;
  getAccountingItems: (
    page: number,
    limit: number,
    startDate: string,
    endDate: string
  ) => Promise<void>;
  addAddItem: (payload: AddItem) => Promise<boolean>;
}
