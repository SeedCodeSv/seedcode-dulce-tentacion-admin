
import { SVFE_ND_Firmado } from '../../types/svf_dte/nd.types';

import { Debit, DebitContingence, NotaDebito } from '@/types/debit-notes.types';

export interface IDebitNotes {
  json_debit: SVFE_ND_Firmado | undefined;
  debit_note: Debit | undefined;
  recent_debit_notes: NotaDebito[];
  loading_debit: boolean;
  contingence_debits: DebitContingence[]
  onGetSaleAndDebit: (id: number) => void;
  onGetRecentDebitNotes: (id: number, saleId: number) => void;
  onGetContingenceNotes: (id: number) => void;
}