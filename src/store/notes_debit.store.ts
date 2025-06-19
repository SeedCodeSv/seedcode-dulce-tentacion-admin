import { create } from "zustand";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { toast } from "sonner";

import { IDebitNotes } from "./types/notas_debito.store.types";

import { get_contingence_debit_notes, get_debit_notes, get_debit_notes_by_id, get_recent_debit_notes } from "@/services/debit_notes.service";
import { s3Client } from "@/plugins/s3";
import { SPACES_BUCKET } from "@/utils/constants";
import { SVFE_ND_Firmado } from "@/types/svf_dte/nd.types";
import { initialPagination } from "@/utils/utils";


export const useDebitNotes = create<IDebitNotes>((set, get) => ({
    json_debit: undefined,
    loading_debit: false,
    debit_note: undefined,
    recent_debit_notes: [],
    contingence_debits: [],
     debit_notes_list: {
        debit_notes: [],
        ...initialPagination
      },
      loading: false,
    onGetContingenceNotes(id) {
        get_contingence_debit_notes(id)
            .then((res) => {
                set({ contingence_debits: res.data.debits })
            })
            .catch(() => {
                set({contingence_debits: [] })
            });
    },

    onGetRecentDebitNotes(id, saleId) {
        get_recent_debit_notes(id, saleId)
            .then((res) => {
                set({ recent_debit_notes: res.data.notaDebito})
            })
            .catch(() => {
                set({contingence_debits: []})
            })
    },

    onGetSaleAndDebit(id) {
        set({loading_debit: true});
        get_debit_notes_by_id(id)
            .then(async (res) => {
                const { pathJson, sale } = res.data.debit;

                get().onGetRecentDebitNotes(id, sale.id);
                const url = await getSignedUrl(
                    s3Client,
                    new GetObjectCommand({
                        Bucket: SPACES_BUCKET,
                        Key: pathJson,
                    })
                );

                axios
                    .get<SVFE_ND_Firmado>(url, {responseType: 'json'})
                    .then(({data}) => {
                        set({json_debit: data, loading_debit: false});
                    }) 
                    .catch(() => {
                        toast.error("Error al cargar la nota de débito");
                        set({ json_debit: undefined, loading_debit: false});
                    });
            })
            .catch(() => {
                toast.error("Error al cargar la nota de débito");
                set({ json_debit: undefined, loading_debit: false})
            })
    },
    onGetDebitNotesPaginated(params) {
         set({loading: true})
            get_debit_notes(params).then(({ data }) => {
              set({ debit_notes_list: data, loading: false});
            })
              .catch(() => {
                set({
                  debit_notes_list: {
                    debit_notes: [],
                    ...initialPagination
                  },
                  loading: false
                });
              });
    },
}))