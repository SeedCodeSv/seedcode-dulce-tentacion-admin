import { Dispatch, SetStateAction } from 'react';

import { DocumentoNoteOfRemission } from '@/shopping-branch-product/types/notes_of_remision.types';
import { PayloadMH } from '@/types/DTE/credito_fiscal.types';

export interface IPropSendToMhShippingNote {
  data_send: PayloadMH;
  json: DocumentoNoteOfRemission;
  firma: string;
  OnClearProductSelectedAll: () => void;
  setCurrentState: (slep: string) => void;
  closeModal: () => void;
  pointOfSaleId: number;
  setTitleMessage: Dispatch<SetStateAction<string>>;
  setErrors: Dispatch<SetStateAction<string[]>>;
  customerId?: number;
  employeeId?: number;
  receivingBranchId?: number;
  receivingEmployeeId?: number;
}
