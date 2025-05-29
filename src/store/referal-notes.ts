import { create } from 'zustand';
import { toast } from 'sonner';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

import { ReferalNoteStore } from './types/referal-notes.types.store';

import { complete_referal_note, detail_referal_note, get_list_referal_note, get_referal_note_recent, get_referal_notes } from '@/services/referal-notes.service';
import { s3Client } from '@/plugins/s3';
import { SPACES_BUCKET } from '@/utils/constants';
import { SVFC_NRE_Firmado } from '@/types/svf_dte/nre.types';
import { IPagination } from '@/types/global.types';

export const useReferalNote = create<ReferalNoteStore>((set) => ({
  referalNotes: [],
  pagination_referal_notes: {
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  referalNote: [],
  detailNoteReferal: [],
  loading: false,
  json_referal_note_copy: undefined,
  json_referal_note: undefined,
  recentReferalNote: [],
  pagination_referal_notesNot: {} as IPagination,
  onGetReferalNotes: (id, page, limit, startDate, endDate, state) => {
    set({ loading: true });
    get_referal_notes(id, page, limit, startDate, endDate, state)
      .then(({ data }) => {
        if (data.referalNotes.length > 0) {
          set({
            referalNotes: data.referalNotes,
            pagination_referal_notes: data,
            loading: false,
          });
        } else {
          set({
            referalNotes: [],
            pagination_referal_notes: {
              total: 0,
              totalPag: 0,
              currentPag: 0,
              nextPag: 0,
              prevPag: 0,
              status: 404,
              ok: false,
            },
            loading: false,
          });
        }
      })
      .catch(() => {
        set({
          referalNotes: [],
          pagination_referal_notes: {
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 404,
            ok: false,
          },
          loading: false,
        });
      });
  },
  async completeReferalNote(id, payload) {
    try {
      const { ok } = await complete_referal_note(id, payload);

      if (!ok) {
        toast.error('Error al completar');

        return false;
      }

      toast.success('Nota de remisión completada');

      return true;
    } catch {
      toast.error('Error al completar');

      return false;
    }
  },
  async getJsonReferelNote(path) {
    set({ loading: true })
    try {
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: SPACES_BUCKET,
          Key: path
        })
      )
      const response = await fetch(url)
      const data: SVFC_NRE_Firmado = await response.json()

      set({
        json_referal_note: {
          ...data,
          itemsCopy: data.cuerpoDocumento,
          indexEdited: []
        },
        json_referal_note_copy: { ...data },
        loading: false
      })
    } catch (error) {
      set({ loading: false })
    }
  },
  async getReferalNoteDetail() {
    try {
    } catch (error) { }
  },
  async getRecentReferal(id) {
    return await get_referal_note_recent(id)
      .then((data) => {
        set({
          recentReferalNote: data.data.referalNotes
        })
      })
      .catch(() => {
        set({
          recentReferalNote: []
        })
      })
  },
  async getReferalNoteByBranch(id, page, limit) {
    return get_list_referal_note(id, page, limit).then(({ data }) => {
      set({
        referalNote: data.NoteRerefal,
        pagination_referal_notesNot: {
          total: data.total,
          totalPag: data.totalPag,
          currentPag: data.currentPag,
          nextPag: data.nextPag,
          prevPag: data.prevPag,
          status: data.status,
          ok: data.ok
        }
      })
    }).catch(() => [
      set({
        referalNote: [],
        pagination_referal_notesNot: {} as IPagination
      })
    ])
  },
  async getDetailNote(id) {
    return detail_referal_note(id).then(({ data }) => {
      set({
        detailNoteReferal: data.detailNote
      })
    }).catch(() => {
      set({
        detailNoteReferal: []
      })
    })
  }

}));
