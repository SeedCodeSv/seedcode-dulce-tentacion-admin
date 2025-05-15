import { Dispatch, SetStateAction } from 'react';

import { DocumentoNoteOfRemission } from '@/shopping-branch-product/types/notes_of_remision.types';
import { RespuestaMH } from '@/types/DTE/DTE.types';

export interface IPropHadleUploadFile {
  json: DocumentoNoteOfRemission;
  firma: string;
  respuestaMH: RespuestaMH;
  OnClearProductSelectedAll: () => void;
  setCurrentState: (step: string) => void;
  setTitleMessage: Dispatch<SetStateAction<string>>;
  setErrors: Dispatch<SetStateAction<string[]>>;
  closeModal: () => void;
  pointOfSaleId: number;
  employeeId?: number;
  customerId?: number;
  receivingBranchId?: number;
  receivingEmployeeId?:number
}
