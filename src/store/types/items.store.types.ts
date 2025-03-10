import { Item, MajorAccount, MajorAccountDailyMajor } from '@/types/items.types';

export interface IItemsState {
  items: Item[];
  loadingItems: boolean;
  majorItems: MajorAccount[];
  loadingMajorAccount: boolean;
  dailyMajorItems: MajorAccountDailyMajor[];
  loadingDailyMajor: boolean;
  dailyMajorItemsAccount: MajorAccountDailyMajor[];
  loadingDailyMajorAccount: boolean;
  majorAccounts: MajorAccount[];
  loadingMajorAccounts: boolean;
  getMajorAccounts: () => void;
  getItemsByMajor: (transId: number, startDate: string, endDate: string) => Promise<MajorAccount[]>;
  getItemsByDates: (transId: number, startDate: string, endDate: string) => Promise<Item[]>;
  getItemsByDailyMajor: (
    transId: number,
    startDate: string,
    endDate: string
  ) => Promise<MajorAccountDailyMajor[]>;
  getItemsByDailyMajorAccount: (
    transId: number,
    startDate: string,
    endDate: string,
    account: string[]
  ) => Promise<MajorAccountDailyMajor[]>;
}
