import { ProductMostSelled } from '../../../types/reports/branch_product.reports';

export interface IBranchProductReportStore {
  most_product_selled: ProductMostSelled[];
  getMostProductMostSelled: (id: number) => void;
}
