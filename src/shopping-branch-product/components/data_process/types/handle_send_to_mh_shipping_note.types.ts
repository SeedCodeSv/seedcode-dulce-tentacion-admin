import { Dispatch, SetStateAction } from 'react';
import { Socket } from 'socket.io-client'

import { DocumentoNoteOfRemission } from '@/shopping-branch-product/types/notes_of_remision.types';
import { PayloadMH } from '@/types/DTE/credito_fiscal.types';
import { ITransmitter } from '@/types/transmitter.types';
import { User, UserLogin } from '@/types/auth.types';
import { Correlativo } from '@/types/correlatives_dte.types';

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
    socket:Socket;
  branchIssuingId:number
  orderId?: number,
  transmitter:ITransmitter | undefined
user:User | undefined
correlatives:Correlativo | undefined
}
