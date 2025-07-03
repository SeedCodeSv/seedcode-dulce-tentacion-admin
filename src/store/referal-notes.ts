import { create } from 'zustand';
import { toast } from 'sonner';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { persist } from 'zustand/middleware'

import { IReferalNoteStore, ReferalNoteStore } from './types/referal-notes.types.store';

import { complete_referal_note, detail_referal_note, get_list_referal_note, get_referal_in_contingence, get_referal_note_recent, get_referal_notes } from '@/services/referal-notes.service';
import { s3Client } from '@/plugins/s3';
import { SPACES_BUCKET } from '@/utils/constants';
import { SVFC_NRE_Firmado } from '@/types/svf_dte/nre.types';
import { IPagination } from '@/types/global.types';
import { DetailNote } from '@/types/referal-note.types';

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
  hasNewNotification: false,
  referalNote: [],
  detailNoteReferal: [],
  loading: false,
  json_referal_note_copy: undefined,
  json_referal_note: undefined,
  recentReferalNote: [],

  pagination_referal_notesNot: {} as IPagination,
  contingence_referal_note: [],
  getReferalNoteContingence(id) {
    get_referal_in_contingence(id).then(({ data }) => {
      set({
        contingence_referal_note: data.contingence_referal
      })
    }).catch(() => {
      set({
        contingence_referal_note: []
      })
    })
  },
  onGetReferalNotes: (id, page, limit, startDate, endDate, state, branchId) => {
    set({ loading: true });
    get_referal_notes(id, page, limit, startDate, endDate, state, branchId)
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
  async getReferalNoteByBranch(id, page, limit, important) {
    return get_list_referal_note(id, page, limit, important).then(({ data }) => {
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
    try {
      const res = await detail_referal_note(id)

      set({
        detailNoteReferal: res.data.detailNote
      })

      return { ok: true, note: res.data.detailNote };
    } catch (error) {
      set({
        detailNoteReferal: []
      })

      return {ok: false, note: [] as DetailNote[]}
    }

  },
  setHasNewNotification: (value) => set({ hasNewNotification: value }),

}));


const MAX_NOTIFICATIONS = 50;
const ONE_DAY = 1000 * 60 * 60 * 24;

export const useReferalNoteStore = create<IReferalNoteStore>()(
  persist(
    (set, get) => ({
      INVALIDATIONS_NOTIFICATIONS: [],
      OTHERS_NOTIFICATIONS: [],

      saveOthersNotifications: (data) => {
        const now = Date.now();
        const existing = get().OTHERS_NOTIFICATIONS;

        const combined = [...data, ...existing];

        // Elimina duplicados por contenido (usando JSON.stringify)
        const unique = Array.from(
          new Map(
            combined.map((n) => [JSON.stringify(n), n])
          ).values()
        );

        // Filtro por tiempo + límite
        const filtered = unique
          .filter((n) => now - Number(n?.time ?? 0) < ONE_DAY)
          .slice(0, MAX_NOTIFICATIONS);

        set({ OTHERS_NOTIFICATIONS: filtered });
      },

      saveNotifications: (data) => {
        const now = Date.now();
        const existing = get().INVALIDATIONS_NOTIFICATIONS;

        const combined = [...data, ...existing];

        const unique = Array.from(
          new Map(
            combined.map((n) => [JSON.stringify(n), n])
          ).values()
        );

        const filtered = unique
          .filter((n) => now - n.timestamp < ONE_DAY)
          .slice(0, MAX_NOTIFICATIONS);

        set({ INVALIDATIONS_NOTIFICATIONS: filtered });
      },

      clearNotifications: () => {
        set({
          INVALIDATIONS_NOTIFICATIONS: [],
          OTHERS_NOTIFICATIONS: [],
        });
      }
    }),
    {
      name: 'referal-note-storage',
    }
  )
);

// export const useReferalNoteStore = create<IReferalNoteStore>()(
//   persist(
//     (set) => ({
//       INVALIDATIONS_NOTIFICATIONS: [],
//       OTHERS_NOTIFICATIONS: [],
//       // saveOthersNotifications: (data) => {
//       //   const oneDay = 1000 * 60 * 60 * 24;
//       //   const now = Date.now();
//       //   const filtered = data.filter(n => now - Number(n?.time ?? 0) < oneDay);

//       //   set({ OTHERS_NOTIFICATIONS: filtered });
//       // },
//       saveOthersNotifications: (data) => {
//         set((state) => {
//           const oneDay = 1000 * 60 * 60 * 24;
//           const now = Date.now();
//           const combined = [...data, ...state.OTHERS_NOTIFICATIONS];

//           const unique = Array.from(
//             new Map(combined.map(n => [n.id, n])).values()
//           );

//           const filtered = unique
//             .filter(n => now - Number(n?.time ?? 0) < oneDay)
//             .slice(0, 50); // limitar cantidad

//           return { OTHERS_NOTIFICATIONS: filtered };
//         });
//       }
//       ,
//       saveNotifications: (data) => {
//         const oneDay = 1000 * 60 * 60 * 24;
//         const now = Date.now();
//         const filtered = data.filter(n => now - n.timestamp < oneDay);

//         set({ INVALIDATIONS_NOTIFICATIONS: filtered });
//       },
//     }),
//     {
//       name: 'referal-note-storage',
//     }
//   )
// );