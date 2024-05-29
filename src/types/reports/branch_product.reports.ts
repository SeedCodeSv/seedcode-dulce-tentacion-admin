
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


