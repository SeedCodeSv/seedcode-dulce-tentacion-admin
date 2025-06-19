import { Credit, CreditContingence, IGetListCreditNotes, NotaCredito } from "@/types/credit_notes.types";
import { SearchGlobal } from "@/types/global.types";
import { SVFE_NC_Firmado } from "@/types/svf_dte/nc.types";

export interface ICreditNotes {
    json_credit: SVFE_NC_Firmado | undefined;
    credit_note: Credit | undefined;
    recent_credit_notes: NotaCredito[];
    loading_credit: boolean;
    contingence_credits: CreditContingence[];
    credit_notes_list: IGetListCreditNotes
    loading: boolean
    onGetSaleAndCredit: (id: number) => void;
    onGetRecentCreditNotes: (id: number, saleId: number) => void;
    onGetContingenceNotes: (id: number) => void;
    onGetCreditNotesPaginated: (params: SearchGlobal) => void
  }