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

//Report sales by product and branch
// export interface SaleByProduct {
//   branchProduct: {
//     name: string
//     code: string
//     price: string
//     id: number
//   }
//   quantity: string
//   total: string
// }
// export interface IGetReportSalesByProduct {
//   ok: boolean
//   products: SaleByProduct[]
// }
