import { AddItem, EditItem, Item, ItemDetails, ReportForItem } from '@/types/accounting-items.types';
import { IPagination } from '@/types/global.types';

export interface AccountingItemsServiceStore {
  accounting_items: Item[];
  report_for_item: ReportForItem[][];
  loading: boolean;
  details: ItemDetails | undefined;
  loading_details: boolean;
  accounting_items_pagination: IPagination;
  search_item: {
    is_first_time: boolean;
    page: number;
    limit: number;
    startDate: string;
    endDate: string;
    typeItem: string;
  };
  getAccountingItems: (
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
    typeItem: string
  ) => Promise<void>;
  addAddItem: (payload: AddItem) => Promise<Item | undefined>;
  updateAndDeleteItem: (id:number,payload: AddItem) => Promise<boolean>;
  editItem: (payload: EditItem, id: number) => Promise<boolean>;
  getDetails: (id: number) => Promise<void>;
  deleteItem: (id: number) => Promise<boolean>;
  getReportForItem: (id: number) => Promise<void>;
}
