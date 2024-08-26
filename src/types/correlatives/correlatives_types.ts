import { Branch } from '../users.types';

export interface IResponseDataCorrelatives {
  ok: boolean;
  status: number;
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;

  correlatives?: Correlatives[];
}

export interface Correlatives {
  code?: string;
  typeVoucher?: string;
  resolution?: string;
  serie?: string;
  from?: string;
  to?: string;
  prev?: number;
  next?: number;
  id?: number;
  branch?: Branch;
}

export interface CreateCorrelativesDto {
  code: string;
  typeVoucher: string;
  resolution: string;
  serie: string;
  from: string;
  to: string;
  prev: number;
  next: number;
  branchId: number | string;
}

export interface ICorrelativeStore {
  pagination_correlatives: IResponseDataCorrelatives;
  correlatives: Correlatives[];
  OnCreateCorrelatives: (correlative: CreateCorrelativesDto) => Promise<CreateCorrelativesDto>;
  OnUpdateCorrelative: (id: number, correlative: Correlatives) => Promise<ResponseDataCorrelative>;
  OnGetByBranchAndTypeVoucherCorrelatives: (
    page: number,
    limit: number,
    branchName: string,
    typeDte: string
  ) => void;
}

export interface ResponseDataCorrelative {
  ok: boolean;
  status: number;
  message: string;
}
export interface IPropsCorrelativeUpdate {
  onClose: () => void;
  reload: () => void;
  correlative?: Correlatives;
  id?: number;
}
