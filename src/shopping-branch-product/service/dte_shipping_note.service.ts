import axios, { CancelTokenSource } from 'axios';

import { DocumentoNoteOfRemission } from '../types/notes_of_remision.types';

import { API_FIRMADOR, API_URL, MH_DTE } from '@/utils/constants';
import { PayloadMH } from '@/types/DTE/credito_fiscal.types';
import { ResponseMHSuccess } from '@/types/DTE/contingencia.types';


export const send_to_mh = (
  payload: PayloadMH,
  token: string,
  cancelToken?: CancelTokenSource | null,
  abortController?: AbortController
) => {
  const config: any = {
    headers: {
      Authorization: token,
    },
  };

  if (cancelToken) {
    config.cancelToken = cancelToken.token;
  } else if (abortController) {
    config.signal = abortController.signal;
  }

  return axios.post<ResponseMHSuccess>(MH_DTE, payload, config);
};
export const firmarNotaDeEnvio = (payload: DocumentoNoteOfRemission) => {
  return axios.post<{ body: string }>(API_FIRMADOR, payload);
};
const formatType = (type: string) => {
  switch (type) {
    case '01':
      return 'FACTURA CONSUMIDOR FINAL'
    case '03':
      return 'COMPROBANTE DE CRÉDITO FISCAL'
    case '04':
      return 'NOTA DE REMISION'
    case '05':
      return 'NOTA DE CRÉDITO'
    case '14':
      return 'SUJETO EXCLUIDO'
    default:
      return ''
  }
}

export const notify_error_telegram = (
  transmitter: string,
  errorTitle: string,
  errors: string[],
  numeroControl: string,
  codigoGeneracion: string,
  tipoDte: string
) => {
  return axios.post(API_URL + '/telegram/send-message', {
    transmitterName: transmitter + ' - ' + formatType(tipoDte),
    errorTitle,
    generationCode: `Codigo generacion: ${codigoGeneracion}`,
    controlNumber: 'Numero control: ' + numeroControl,
    errors
  })
}