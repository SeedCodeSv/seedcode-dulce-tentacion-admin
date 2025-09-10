import { IPagination } from '@/types/global.types';
import { SearchReport } from '@/types/reports/productsSelled.report.types';
import { DataKardex, IDetaiLAdjustment, IReportKardexByProduct, IReportKardexGeneral, Kardex, KardexByProduct } from '@/types/reports/reportKardex.types';

export interface IReportKardexStore {
  kardex: Kardex[];
  totales: {
    initialStock: number,
    totalEntradas: number,
    totalSalidas: number,
    productName: string,
    stockActual: number
  }
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
    getReportKardexByProductExport: (params: SearchReport) => Promise<{ok: boolean, KardexProduct: IReportKardexByProduct}>;
  getReportKardexGeneral: (params: SearchReport) => void;
  getReportKardexGeneralExport: (params: SearchReport
  ) => Promise<{ ok: boolean, kardexGeneral: IReportKardexGeneral }>;
}