import axios from "axios";
import { IGetAmbienteDestino } from "../types/DTE/ambiente_destino.types";
import { API_FIRMADOR, FACTURACION_API, MH_DTE, MH_URL } from "../utils/constants";
import { DteJson, PayloadMH } from "../types/DTE/credito_fiscal.types";
import { ResponseMHSuccess } from "../utils/DTE/contingencia.types";
import { IGetFormasDePago } from "../types/DTE/forma_de_pago.types";
import { IGetTiposDocumento } from "../types/DTE/tipo_documento.types";
import { IGetTipoTributos } from "../types/DTE/tipo_tributo.types";
import { ISendMHFiscal } from "../types/DTE/credito_fiscal.types";
import { IContingencia, ISendMHContingencia } from "../utils/DTE/contingencia.types";

export const get_ambiente_destino = () => {
  return axios<IGetAmbienteDestino>(
    FACTURACION_API + "/cat-001-ambiente-de-destino"
  );
};

export const send_to_mh = async (payload: PayloadMH, token: string) => {
  return axios.post<ResponseMHSuccess>(MH_DTE, payload, {
    headers: {
      Authorization: token,
    },
  });
};

export const send_to_mh_contingencia = async (payload: ISendMHContingencia, token: string) => {
  return axios.post<ResponseMHSuccess>(MH_URL + "contingencia", payload, {
    headers: {
      Authorization: token,
    },
  });
};


export const get_metodos_de_pago = () => {
  return axios.get<IGetFormasDePago>(FACTURACION_API + "/cat-017-forma-de-pago");
};

export const get_tipos_de_documento = () => {
  return axios.get<IGetTiposDocumento>(
    FACTURACION_API + "/cat-002-tipo-de-documento"
  );
};

export const get_tipos_de_tributo = () => {
  return axios.get<IGetTipoTributos>(FACTURACION_API + "/cat-015-tributos");
};

export const firmarDocumentoFiscal = (payload: ISendMHFiscal) => {
  return axios.post<{ body: string }>(API_FIRMADOR, payload);
};

export const firmarDocumentoFactura = (payload: DteJson) => {
  return axios.post<{ body: string }>(API_FIRMADOR, payload);
};

export const firmarDocumentoContingencia = (payload: IContingencia) => {
  return axios.post<{ body: string }>(API_FIRMADOR, payload);
};