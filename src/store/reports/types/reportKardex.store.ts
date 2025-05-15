import { IPagination } from '@/types/global.types';
import { IDetaiLAdjustment, Kardex } from '@/types/reports/reportKardex.types';

export interface IReportKardexStore {
  kardex: Kardex[];
  details: IDetaiLAdjustment[];
  loading: boolean;
  pagination_kardex: IPagination;
  OnGetReportKardex: (id: number, page: number, limit: number, name: string) => void;
  OnGetDetailsByProduct: (id: number) => void;
}