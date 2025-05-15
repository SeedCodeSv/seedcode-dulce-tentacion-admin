import { IPagination } from '@/types/global.types';
import { ReferalNote } from '@/types/referal-note.types';

export interface ReferalNoteStore {
  referalNotes: ReferalNote[];
  pagination_referal_notes: IPagination;
  loading: boolean;
  onGetReferalNotes: (
    id: number,
    page: number,
    limit: number,
    startDate: string,
    endDate: string
  ) => void;
  completeReferalNote: (id: number) => Promise<boolean>;
}
