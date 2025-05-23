import { Sale } from '../report_contigence';

export interface IInvalidationToMH {
  ambiente: string;
  version: number;
  idEnvio: number;
  documento: string;
}

export interface ISignInvalidationData {
  nit: string;
  passwordPri: string;
  dteJson: IInvalidationBody;
}

export interface IInvalidationBody {
  identificacion: Identificacion;
  emisor: Emisor;
  documento: Documento;
  motivo: Motivo;
}

interface Documento {
  tipoDte: string;
  codigoGeneracion: string;
  codigoGeneracionR: null | string;
  selloRecibido: string;
  numeroControl: string;
  fecEmi: string;
  montoIva: number;
  tipoDocumento: string;
  numDocumento: string;
  nombre: string;
}

interface Emisor {
  nit: string;
  nombre: string;
  tipoEstablecimiento: string;
  telefono: string;
  correo: string;
  codEstable: null | string;
  codPuntoVenta: null | string;
  nomEstablecimiento: string;
}

interface Identificacion {
  version: number;
  ambiente: string;
  codigoGeneracion: string;
  fecAnula: string;
  horAnula: string;
}

interface Motivo {
  tipoAnulacion: number;
  motivoAnulacion: string;
  nombreResponsable: string;
  tipDocResponsable: string;
  numDocResponsable: string;
  nombreSolicita: string;
  tipDocSolicita: string;
  numDocSolicita: string;
}

export interface IResponseInvalidationMH {
  version: number;
  ambiente: string;
  versionApp: number;
  estado: string;
  codigoGeneracion: string;
  selloRecibido: string | null;
  fhProcesamiento: string | null;
  clasificaMsg: null;
  codigoMsg: string;
  descripcionMsg: string;
  observaciones: string[];
}

export interface IGetRecentSales {
  ok: boolean;
  status: number;
  sales: Sale[];
}

export interface IInvalidationResponse {
  ok: boolean;
  status: number;
  message: string;
}

export const invalidationTypes = [
  {
    id: 1,
    codigo: '1',
    valores: 'Error en la Información del Documento Tributario Electrónico a invalidar.',
  },
  {
    id: 2,
    codigo: '2',
    valores: "Rescindir de la operación realizada.",
    isActivated: true
  },
  {
    id: 3,
    codigo: '3',
    valores: 'Otro',
  },
];
