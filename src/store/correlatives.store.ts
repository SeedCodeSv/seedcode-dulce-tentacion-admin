import { create } from 'zustand';
import { toast } from 'sonner';

import { messages } from '../utils/constants';
import { get_correlatives } from '../services/correlatives.service';

import { ICorrelativesStore } from './types/correlatives_store.types';

export const useCorrelativesStore = create<ICorrelativesStore>((set) => ({
  list_correlatives: [],
  get_correlativesByBranch: (id: number): void => {
    get_correlatives(id)
      .then(({ data }) => {
        set({
          list_correlatives: data.pointOfSales,
        });
      })
      .catch(() => {
        toast.error(messages.error);
        set({
          list_correlatives: [],
        });
      });
  },
}));
