import { ProductMostSelled } from '../../../types/reports/branch_product.reports';
import { IDataProductGrafic } from '../../../types/reports/sales.reports.types';

export interface IBranchProductReportStore {
  most_product_selled: ProductMostSelled[];
  data: IDataProductGrafic[];
  getMostProductMostSelled: (id: number) => void;
  getProductMostSelledGrafic: (
    id: number,
    startDate: string,
    endDate: string,

  ) => void;
}
