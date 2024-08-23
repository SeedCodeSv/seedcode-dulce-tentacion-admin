export interface Correlatives {
  code: string;
  typeVoucher: string;
  resolution: string;
  serie: string;
  from: string;
  to: string;
  prev: number;
  next: number;
  isActive: boolean;

  branchId: number;
}

export interface IGetCorrelatives {
  ok: boolean;
  status: number;
  correlatives: Correlatives[];
}
