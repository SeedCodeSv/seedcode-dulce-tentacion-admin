export interface Branches {
  id: number;
  name: string;
  address: string;
  phone: string;
  next: number;
  prev: number;
  isActive: boolean;
}

export interface IGetBranchesPaginated {
  ok: boolean;
  branches: Branches[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface IBranchForm {
  name: string;
  phone: string;
  address: string;
}

export interface IBranchPayload extends IBranchForm {
  transmitterId: number;
}

export interface IGetBranchesList {
  ok: boolean;
  message: string;
  branches: Branches[];
  status: number;
}