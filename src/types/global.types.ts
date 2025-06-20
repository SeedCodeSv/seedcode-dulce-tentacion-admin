export type Size =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'xs'
  | '3xl'
  | '4xl'
  | '5xl'
  | 'full'
  | undefined;

export interface IPagination {
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
  ok: boolean;
}


export interface BasicResponse {
  ok: boolean;
  message: string;
  status: number
}


export interface SearchGlobal {
  branchId: number;
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  status?: string
}