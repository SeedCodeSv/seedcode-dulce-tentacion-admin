
import { ICharge, IGetChargesPaginated } from "../../types/charges.types";

export interface IChargesStore {
  charges: ICharge[];
  charges_paginated: IGetChargesPaginated;
  getChargesList: () => void;
  getChargesPaginated: (page: number, limit: number, name: string, active?: number) => void;
  postCharge: (name:string) => void;
  patchCharge: (name: string, id: number) => void;
  deleteCharge: (id: number) => Promise<boolean>;
  activateCharge: (id: number) => Promise<boolean>;
}