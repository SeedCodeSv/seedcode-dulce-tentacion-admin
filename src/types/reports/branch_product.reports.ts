
export interface BranchProduct {
  name: string;
  code: string;
  price: string;
  id: number;
}

export interface ProductMostSelled {
  branchProduct: BranchProduct;
  quantity: string;
  total: string;
  branch: string;
}

export interface IGetProductMostSelled {
  ok: boolean;
  products: ProductMostSelled[];
}

export interface IResponseData {
  ok: boolean;
  status: number;
  data: IDataSalesResponse[];
}

export interface IDataSalesResponse {
  date: string;
  sales: ISalesData[];
}

export interface ISalesData {
  branch: string;
  total: number;
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


