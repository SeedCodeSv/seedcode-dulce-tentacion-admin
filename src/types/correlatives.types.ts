export interface Correlatives {
  id: number;
  code: string;
  typeVoucher: string;
  resolution: string;
  serie: string;
  from: string;
  to: string;
  prev: number;
  next: number;
  isActive: boolean;
  branch: {
    id: number;
    name: string;
    address: string;
    phone: string;
    isActive: boolean;
    transmitterId: number;
  };
  branchId: number;
}

export interface IGetCorrelatives {
  ok: boolean;
  status: number;
  correlatives: Correlatives[];
}
