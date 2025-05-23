import { IPagination } from '@/types/global.types';
import { IReferal_JSON_Note, PayloadReferel, ReferalNote } from '@/types/referal-note.types';
import { SVFC_NRE_Firmado } from '@/types/svf_dte/nre.types';

export interface ReferalNoteStore {
  referalNotes: ReferalNote[];
  pagination_referal_notes: IPagination;
  loading: boolean;
  json_referal_note: IReferal_JSON_Note | undefined
  json_referal_note_copy: SVFC_NRE_Firmado | undefined
  recentReferalNote: ReferalNote[]
  onGetReferalNotes: (
    id: number,
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
    state:string
  ) => void;
  completeReferalNote: (id: number, payload:PayloadReferel) => Promise<boolean>;
  getJsonReferelNote: (path: string) => void
  getReferalNoteDetail: (id: number) => void
  getRecentReferal: (id: number) => void

}
