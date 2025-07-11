import { BranchProduct } from "../branch_products.types";
import { IPagination } from "../global.types";

export interface BranchProductR {
  name: string;
  code: string;
  price: string;
  id: number;
}

export interface ProductMostSelled {
  branchProduct: BranchProductR;
  quantity: string;
  total: string;
  branch: string;
}

export interface IGetProductMostSelled {
  ok: boolean;
  products: ProductMostSelled[];
}
export interface IResponseDataSalesGrafic {
  ok: boolean;
  data: IDataSalesGrafic[];
}

export interface IDataSalesGrafic {
  branch  : string;
  total   : string;
}


export interface IDataExpense {
  id: number;
  description: string;
  total: number;
  boxId: number;
  categoryExpenseId: number;
  isActive: boolean;
}

export interface IResponseDataExpenses {
  ok: boolean;
  expenses: IDataExpense[];
}

export interface IGetProductLoss extends IPagination {
  productLoss: ProductLoss[];
}

export interface ProductLoss {
  id:              number;
  branchProductId: number;
  source:          string;
  referenceId:     string;
  observation:     string;
  quantity:        string;
  date:            string;
  branchProduct:   BranchProduct;
}


