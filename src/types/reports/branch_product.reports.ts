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
