import axios, { CancelTokenSource } from "axios";
import { IGetAmbienteDestino } from "../types/DTE/ambiente_destino.types";
import { API_FIRMADOR, CHECK_URL, FACTURACION_API, MH_DTE, MH_URL } from "../utils/constants";
import { PayloadMH } from "../types/DTE/credito_fiscal.types";
import { ResponseMHSuccess } from "../types/DTE/contingencia.types";
import { IGetFormasDePago } from "../types/DTE/forma_de_pago.types";
import { IGetTiposDocumento } from "../types/DTE/tipo_documento.types";
import { IGetTipoTributos } from "../types/DTE/tipo_tributo.types";
import { ISendMHFiscal } from "../types/DTE/credito_fiscal.types";
import { IContingencia, ISendMHContingencia } from "../types/DTE/contingencia.types";
import { DteJson as FDteJSON, IDTE } from "../types/DTE/DTE.types"
import { ICheckPayload, ICheckResponse } from "../types/DTE/check.types";
import { IInvalidationToMH, IResponseInvalidationMH, ISignInvalidationData } from "../types/DTE/invalidation.types";

export const get_ambiente_destino = () => {
  return axios<IGetAmbienteDestino>(FACTURACION_API + '/cat-001-ambiente-de-destino');
};

export const send_to_mh = async (
  payload: PayloadMH,
  token: string,
  cancelToken: CancelTokenSource
) => {
  return axios.post<ResponseMHSuccess>(MH_DTE, payload, {
    headers: {
      Authorization: token,
    },
    cancelToken: cancelToken.token,
  });
};

export const send_to_mh_contingencia = async (payload: ISendMHContingencia, token: string) => {
  return axios.post<ResponseMHSuccess>(MH_URL + 'contingencia', payload, {
    headers: {
      Authorization: token,
    },
  });
};

export const send_to_mh_invalidation = async (payload: IInvalidationToMH) => {
  return axios.post<IResponseInvalidationMH>(`${MH_URL}anulardte`, payload, {
    headers: {
      Authorization: localStorage.getItem('mh_token'),
    },
  });
};

export const get_metodos_de_pago = () => {
  return axios.get<IGetFormasDePago>(FACTURACION_API + '/cat-017-forma-de-pago');
};

export const get_tipos_de_documento = () => {
  return axios.get<IGetTiposDocumento>(FACTURACION_API + '/cat-002-tipo-de-documento');
};

export const get_tipos_de_tributo = () => {
  return axios.get<IGetTipoTributos>(FACTURACION_API + '/cat-015-tributos');
};

export const firmarDocumentoFiscal = (payload: ISendMHFiscal) => {
  return axios.post<{ body: string }>(API_FIRMADOR, payload);
};

export const firmarDocumentoFactura = (payload: FDteJSON) => {
  return axios.post<{ body: string }>(API_FIRMADOR, payload);
};

export const firmarDocumentoContingencia = (payload: IContingencia) => {
  return axios.post<{ body: string }>(API_FIRMADOR, payload);
};

export const firmarDocumentoInvalidacion = (payload: ISignInvalidationData) => {
  return axios.post<{ body: string }>(API_FIRMADOR, payload);
};

export const get_json_from_space = (url: string) => {
  return axios.get<IDTE>(url, {
    headers: {
      ContentType: 'application/json',
    }
  })
}

export const check_dte = (payload: ICheckPayload, token: string) => {
  return axios.post<ICheckResponse>(
    CHECK_URL,
    {
      ...payload,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};
