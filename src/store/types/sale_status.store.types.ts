import { ISalesStatus } from '../../types/sales_status.types';

export interface ISaleStatusStore {
  saleStatus: ISalesStatus[];
  OnGetSaleStatusList: () => void;
}
