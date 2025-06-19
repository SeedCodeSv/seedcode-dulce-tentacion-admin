
import { SVFE_ND_Firmado } from '../../types/svf_dte/nd.types';

import { SearchGlobal } from '@/types/global.types';
import { Debit, DebitContingence, IGetListDebitNotes, NotaDebito } from '@/types/debit-notes.types';

export interface IDebitNotes {
  json_debit: SVFE_ND_Firmado | undefined;
  debit_note: Debit | undefined;
  recent_debit_notes: NotaDebito[];
  loading_debit: boolean;
  contingence_debits: DebitContingence[]
  debit_notes_list: IGetListDebitNotes
  loading: boolean
  onGetSaleAndDebit: (id: number) => void;
  onGetRecentDebitNotes: (id: number, saleId: number) => void;
  onGetContingenceNotes: (id: number) => void;
  onGetDebitNotesPaginated: (params: SearchGlobal) => void

}