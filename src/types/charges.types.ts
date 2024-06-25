export interface ICharge {
  id: number;
  name: string;
  isActive: boolean;
}

export interface IGetListCharges {
  ok: boolean;
  status: number;
  charges: ICharge[];
}

export interface IGetChargesPaginated {
  ok: boolean;
  charges: ICharge[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}
export interface IChargePayload {
  name: string;
}