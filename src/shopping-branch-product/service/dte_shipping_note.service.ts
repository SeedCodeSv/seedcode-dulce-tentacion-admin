import axios, { CancelTokenSource } from 'axios';

import { DocumentoNoteOfRemission } from '../types/notes_of_remision.types';

import { API_FIRMADOR, MH_DTE } from '@/utils/constants';
import { PayloadMH } from '@/types/DTE/credito_fiscal.types';
import { ResponseMHSuccess } from '@/types/DTE/contingencia.types';


export const send_to_mh = (payload: PayloadMH, token: string, cancelToken: CancelTokenSource) => {
  return axios.post<ResponseMHSuccess>(MH_DTE, payload, {
    headers: {
      Authorization: token,
    },
    cancelToken: cancelToken.token,
  });
};

export const firmarNotaDeEnvio = (payload: DocumentoNoteOfRemission) => {
  return axios.post<{ body: string }>(API_FIRMADOR, payload);
};
