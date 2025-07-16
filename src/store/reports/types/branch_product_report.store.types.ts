import { IGetProductLoss, ProductMostSelled } from '../../../types/reports/branch_product.reports';
import { IDataProductGrafic } from '../../../types/reports/sales.reports.types';

import { SearchReport } from '@/types/reports/productsSelled.report.types';

export interface IBranchProductReportStore {
  most_product_selled: ProductMostSelled[];
  data: IDataProductGrafic[];
  loading_most_selled_product: boolean;
  loadingProductLoss: boolean
  getMostProductMostSelled: (id: number) => void;
  getProductMostSelledGrafic: (
    id: number,
    startDate: string,
    endDate: string,
  ) => void;
  productsLoss: IGetProductLoss
  getProductsLoss: (search: SearchReport) => Promise<{ok: boolean; productsLoss: IGetProductLoss }>
  getProductsLossExport: (search: SearchReport) => Promise<{ok: boolean; productsLoss: IGetProductLoss }>

}
