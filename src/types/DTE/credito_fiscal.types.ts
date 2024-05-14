import { ITransmitter } from "../transmitter.types";
import { Resumen } from "./factura.types";
import { Pago } from "./sub_interface/payment.types";
import { Receptor } from "./sub_interface/receiver.types";
export interface Identificacion {
  version: number;
  codigoGeneracion: string;
  ambiente: string;
  tipoDte: string;
  numeroControl: string;
  tipoModelo: number;
  tipoOperacion: number;
  tipoContingencia?: any;
  motivoContin?: any;
  tipoMoneda: string;
  fecEmi: string;
  horEmi: string;
}

export interface CuerpoDocumento {
  numItem: number | string;
  tipoItem: number | string;
  uniMedida: number | string;
  numeroDocumento?: any;
  cantidad: number | string;
  codigo: string | null;
  codTributo?: any;
  descripcion: string;
  precioUni: number | string;
  montoDescu: number | string;
  ventaNoSuj: number | string;
  ventaExenta: number | string;
  ventaGravada: number | string;
  tributos: string[] | null;
  psv: number | string;
  noGravado: number | string;
}

export interface ICuerpoDocumento {
  numItem: number;
  tipoItem: number;
  numeroDocumento: null | string;
  cantidad: number;
  codigo: string | null;
  codTributo: null | string;
  uniMedida: number;
  descripcion: string;
  precioUni: number | string;
  montoDescu: number | string;
  ventaNoSuj: number | string;
  ventaExenta: number | string;
  ventaGravada: number | string;
  tributos: null | string[];
  psv: number | string;
  noGravado: number | string;
  ivaItem: number | string;
}
export interface DteJson {
  nit: string;
  activo: boolean;
  passwordPri: string;
  dteJson: JSONSend;
}
export interface JSONSend {
  identificacion: Identificacion;
  documentoRelacionado: any;
  emisor: ITransmitter;
  receptor: Receptor;
  otrosDocumentos: any;
  ventaTercero: any;
  cuerpoDocumento: ICuerpoDocumento[];
  resumen: Resumen;
  extension: any;
  apendice: any;
}
export interface Tributo {
  codigo: string;
  descripcion: string;
  valor: number;
}

export interface IResumen {
  totalNoSuj: number | string;
  totalExenta: number | string;
  totalGravada: number | string;
  subTotalVentas: number | string;
  descuNoSuj: number | string;
  descuExenta: number | string;
  descuGravada: number | string;
  porcentajeDescuento: number | string;
  totalDescu: number | string;
  tributos: Tributo[];
  subTotal: number | string;
  ivaRete1: number | string;
  reteRenta: number | string;
  ivaPerci1: number | string;
  montoTotalOperacion: number | string;
  totalNoGravado: number | string;
  totalPagar: number | string;
  totalLetras: string;
  saldoFavor: number | string;
  condicionOperacion: number | string;
  pagos: Pago[];
  numPagoElectronico?: any;
}
export interface DteJson {
  identificacion: Identificacion;
  documentoRelacionado?: any;
  emisor: ITransmitter;
  receptor: Receptor;
  otrosDocumentos?: any;
  ventaTercero?: any;
  cuerpoDocumento: CuerpoDocumento[];
  resumen: IResumen;
  extension?: any;
  apendice?: any;
}

export interface ISendMHFiscal {
  nit: string;
  activo: boolean;
  passwordPri: string;
  dteJson: DteJson;
}

export interface DTEToPDFFiscal {
  version: number;
  ambiente: string;
  versionApp: number;
  estado: string;
  codigoGeneracion: string;
  selloRecibido: string;
  fhProcesamiento: string;
  clasificaMsg: string;
  codigoMsg: string;
  descripcionMsg: string;
  observaciones: string[];
  emisor: ITransmitter;
  receptor: Receptor;
  resumen: IResumen;
  numeroControl: string;
  cuerpoDocumento: CuerpoDocumento[];
}
export interface FiscalReceptor {
  nit: string | null;
  nrc: string | null;
  nombre: string | null;
  codActividad: string | null;
  descActividad: string | null;
  nombreComercial: string | null;
  direccion: {
    departamento: string | null;
    municipio: string | null
    complemento: string | null;
  };
  telefono: string | null;
  correo: string | null;
}
export interface PayloadMH {
  ambiente: string;
  idEnvio: number;
  version: number;
  tipoDte: string;
  documento: string;
}