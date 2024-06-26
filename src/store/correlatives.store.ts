import { create } from 'zustand';
import { toast } from 'sonner';
import { messages } from '../utils/constants';
import { ICorrelativesStore } from './types/correlatives_store.types';
import { get_correlatives } from '../services/correlatives.service';

export const useCorrelativesStore = create<ICorrelativesStore>((set) => ({
  list_correlatives: [],
  get_correlativesByBranch: (id: number): void => {
    get_correlatives(id)
      .then(({ data }) => {
        set({
            list_correlatives: data.correlatives,
        });
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
}));
