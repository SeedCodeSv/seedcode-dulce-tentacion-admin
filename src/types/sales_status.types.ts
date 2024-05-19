export interface IGetSalesStatus {
  ok: boolean;
  status: number;
  saleStatus: ISalesStatus[];
}

export interface ISalesStatus {
  id: number;
  name: string;
  isActive: boolean;
}