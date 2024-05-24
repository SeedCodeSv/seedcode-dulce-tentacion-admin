import { ProductMostSelled } from '../../../types/reports_seller/branch_product.reports_seller';

export interface IBranchProductReportStore {
  most_product_selled: ProductMostSelled[];
  getMostProductMostSelled: (id: number) => void;
}
