import { BranchProduct } from '../branch_products.types';
import { IPagination } from '../global.types';
// import { InventoryAdjustment } from '../inventaryAdjustment.types';

export interface IReportKardex extends IPagination {
  ok: boolean;
  data: Kardex[];
  status: number;
}

export interface Kardex {
  productName: string;
  productCode: string;
  productPrice: string;
  quantity: string;
  entries: number;
  exits: number;
  price: string;
  cost: string;
  utility: number;
  profitability: number;
}

export interface IResponseDetailsByProduct {
  ok: boolean;
  details: IDetaiLAdjustment[];
  status: number;
}

export interface IDetaiLAdjustment {
  id: number;
  previousStock: string;
  remainingStock: string;
  previousPrice: string;
  remainingPrice: string;
  quantity: string;
  typed: string;
  isActive: boolean;
  branchProduct: BranchProduct;
  // inventoryAdjustment: InventoryAdjustment;
  inventoryAdjustmentId: number;
  branchProductId: number;
}
