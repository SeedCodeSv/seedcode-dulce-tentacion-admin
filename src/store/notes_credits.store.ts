import { create } from "zustand";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { toast } from "sonner";

import { ICreditNotes } from "./types/note_credits.types.store";

import { get_contingence_credit_notes, get_credit_notes_by_id, get_recent_credit_notes } from "@/services/credit_notes.service";
import { s3Client } from "@/plugins/s3";
import { SPACES_BUCKET } from "@/utils/constants";
import { SVFE_NC_Firmado } from "@/types/svf_dte/nc.types";


export const useCreditNotes = create<ICreditNotes>((set, get) => ({
    json_credit: undefined,
    loading_credit: false,
    credit_note: undefined,
    recent_credit_notes: [],
    contingence_credits: [],
    onGetContingenceNotes(id) {
      get_contingence_credit_notes(id)
        .then((res) => {
          set({ contingence_credits: res.data.credits });
        })
        .catch(() => {
          set({ contingence_credits: [] });
        });
    },
    onGetRecentCreditNotes(id, saleId) {
      get_recent_credit_notes(id, saleId)
        .then((res) => {
          set({ recent_credit_notes: res.data.notaCredito });
        })
        .catch(() => {
          set({ recent_credit_notes: [] });
        });
    },
    onGetSaleAndCredit(id) {
      set({ loading_credit: true });
      get_credit_notes_by_id(id)
        .then(async (res) => {
          const { pathJson, sale } = res.data.notaDeCredito;

          get().onGetRecentCreditNotes(id, sale.id);
          const url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
              Bucket: SPACES_BUCKET,
              Key: pathJson,
            })
          );
  
          axios
            .get<SVFE_NC_Firmado>(url, { responseType: 'json' })
            .then(({ data }) => {
              set({ json_credit: data, loading_credit: false });
            })
            .catch(() => {
              toast.error('Error al cargar la nota de débito');
              set({ json_credit: undefined, loading_credit: false });
            });
        })
        .catch(() => {
          toast.error('Error al cargar la nota de débito');
          set({ json_credit: undefined, loading_credit: false });
        });
    },
  }));