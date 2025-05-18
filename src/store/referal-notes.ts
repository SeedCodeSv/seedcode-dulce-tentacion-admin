import { create } from 'zustand';
import { toast } from 'sonner';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

import { ReferalNoteStore } from './types/referal-notes.types.store';

import { complete_referal_note, get_referal_note_recent, get_referal_notes } from '@/services/referal-notes.service';
import { s3Client } from '@/plugins/s3';
import { SPACES_BUCKET } from '@/utils/constants';
import { SVFC_NRE_Firmado } from '@/types/svf_dte/nre.types';

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
  loading: false,
  json_referal_note_copy: undefined,
  json_referal_note: undefined,
  recentReferalNote: [],
  onGetReferalNotes: (id, page, limit, startDate, endDate) => {
    set({ loading: true });
    get_referal_notes(id, page, limit, startDate, endDate)
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
  }

}));
