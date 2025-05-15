import { create } from 'zustand';
import { toast } from 'sonner';

import { ReferalNoteStore } from './types/referal-notes.types.store';

import { complete_referal_note, get_referal_notes } from '@/services/referal-notes.service';

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
  async completeReferalNote(id) {
    try {
      const { ok } = await complete_referal_note(id);

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
}));
