import {
  get_by_branch_and_typeVoucher,
  update_correlatives,
} from '@/services/correlatives/correlative.service';

import {
  ICorrelativeStore,
  ResponseDataCorrelative,
} from '@/types/correlatives/correlatives_types';

import { create } from 'zustand';

export const useCorrelativesStore = create<ICorrelativeStore>((set) => ({
  correlatives: [],
  pagination_correlatives: {
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 200,
    ok: true,
  },
  OnGetByBranchAndTypeVoucherCorrelatives: (page, limit, branchName, typDte) => {
    get_by_branch_and_typeVoucher(page, limit, branchName, typDte).then(({ data }) => {
      set({
        correlatives: data.correlatives,
        pagination_correlatives: {
          total: data.total,
          totalPag: data.totalPag,
          currentPag: data.currentPag,
          nextPag: data.nextPag,
          prevPag: data.prevPag,
          status: data.status,
          ok: data.ok,
        },
      });
    });
  },
  OnUpdateCorrelative: (id, correlative): Promise<ResponseDataCorrelative> => {
    return update_correlatives(id, correlative).then(({ data }) => {
      return data;
    });
  },
}));
