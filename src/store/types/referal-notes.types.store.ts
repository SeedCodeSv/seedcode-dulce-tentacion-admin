import { IPagination } from '@/types/global.types';
import { DetailNote, IReferal_JSON_Note, Others, PayloadReferel, ReferalNote } from '@/types/referal-note.types';
import { SVFC_NRE_Firmado } from '@/types/svf_dte/nre.types';

export interface ReferalNoteStore {
  referalNotes: ReferalNote[];
  pagination_referal_notes: IPagination;
  loading: boolean;
  json_referal_note: IReferal_JSON_Note | undefined
  json_referal_note_copy: SVFC_NRE_Firmado | undefined
  recentReferalNote: ReferalNote[]
  referalNote: ReferalNote[]
  pagination_referal_notesNot: IPagination
  detailNoteReferal: DetailNote[]
  hasNewNotification: boolean
  contingence_referal_note: ReferalNote[]

  onGetReferalNotes: (
    id: number,
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
    state: string,
    branchId: number
  ) => void;
  completeReferalNote: (id: number, payload: PayloadReferel) => Promise<boolean>;
  getJsonReferelNote: (path: string) => void
  getReferalNoteDetail: (id: number) => void
  getRecentReferal: (id: number) => void
  getReferalNoteByBranch: (id: number, page: number, limit: number, important: boolean) => void
  getDetailNote: (id: number) => Promise<{ ok: boolean, note: DetailNote[] }>
  setHasNewNotification: (value: boolean) => void
  getReferalNoteContingence: (id: number) => void

}

export interface DataNotification {
  descripcion: string
  fecha: string,
  timestamp: number;
  data: ReferalNote
}

export interface IReferalNoteStore {
  INVALIDATIONS_NOTIFICATIONS: DataNotification[]
  OTHERS_NOTIFICATIONS: Others[]
  saveOthersNotifications: (data: Others[]) => void
  saveNotifications: (data: DataNotification[]) => void
}