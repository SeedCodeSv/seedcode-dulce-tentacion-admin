import { IPagination } from '@/types/global.types';
import { DataKardex, IDetaiLAdjustment, Kardex, KardexByProduct } from '@/types/reports/reportKardex.types';

export interface IReportKardexStore {
  kardex: Kardex[];
  kardexGeneral: DataKardex[] 
  details: IDetaiLAdjustment[];
  loading: boolean;
  pagination_kardex: IPagination;
  KardexProduct: KardexByProduct[];
  paginationKardexProduct: IPagination;
  isLoadinKarProd: boolean;
  OnGetReportKardex: (id: number, page: number, limit: number, name: string) => void;
  OnGetDetailsByProduct: (id: number) => void;
  getReportKardexByProduct: (
    id: number,
    page: number,
    limit: number,
    productName?: string,
    startDate?: string,
    endDate?: string,
    branchProductId?: number,
  ) => void;
  getReportKardexGeneral: (
    id: number,
    page: number,
    limit: number,
    name?: string,
    dateFrom?: string,
    dateTo?: string
  ) => void;
}