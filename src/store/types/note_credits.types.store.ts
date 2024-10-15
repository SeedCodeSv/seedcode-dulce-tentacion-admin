import { Credit, CreditContingence, NotaCredito } from "@/types/credit_notes.types";
import { SVFE_NC_Firmado } from "@/types/svf_dte/nc.types";

export interface ICreditNotes {
    json_credit: SVFE_NC_Firmado | undefined;
    credit_note: Credit | undefined;
    recent_credit_notes: NotaCredito[];
    loading_credit: boolean;
    contingence_credits: CreditContingence[];
    onGetSaleAndCredit: (id: number) => void;
    onGetRecentCreditNotes: (id: number, saleId: number) => void;
    onGetContingenceNotes: (id: number) => void;
  }