import { ResponseMHSuccess } from '../DTE/contingencia.types';

export interface NRE_DteJson {
  identificacion: NRE_Identificacion;
  documentoRelacionado: NRE_DocumentoRelacionado[];
  ventaTercero: NRE_Venta_Terceros;
  emisor: NRE_Emisor;
  receptor: NRE_Receptor;
  resumen: NRE_Resumen;
  extension: NRE_Extension;
  apendice: NRE_Apendice[];
  cuerpoDocumento: NRE_CuerpoDocumento[];
}

export interface SVFC_NRE_Firmado extends NRE_DteJson {
  respuestaMH: ResponseMHSuccess;
  firma: string;
}

export interface SVFE_CF_SEND {
  nit: string;
  activo: boolean;
  passwordPri: string;
  dteJson: NRE_DteJson;
}

export interface NRE_Identificacion {
  version: number;
  ambiente: string;
  tipoDte: string;
  numeroControl: string;
  codigoGeneracion: string;
  tipoModelo: number;
  tipoOperacion: number;
  tipoContingencia: string | null;
  motivoContin: string | null;
  fecEmi: string;
  horEmi: string;
  tipoMoneda: string;
}

export interface NRE_DocumentoRelacionado {
  tipoDocumento: string;
  tipoGeneracion: number;
  numeroDocumento: string;
  fechaEmision: string;
}

export interface NRE_Addres {
  departamento: string;
  municipio: string;
  complemento: string;
}

export interface NRE_Emisor {
  nit: string;
  nrc: string;
  nombre: string;
  codActividad: string;
  descActividad: string;
  nombreComercial: string;
  tipoEstablecimiento: string;
  direccion: NRE_Addres;
  telefono: string;
  correo: string;
  codEstableMH: string;
  codEstable: string | null;
  codPuntoVentaMH: string;
  codPuntoVenta: string;
}

export interface NRE_Receptor {
  tipoDocumento: string;
  numDocumento: string;
  nrc: string | null;
  nombre: string;
  codActividad: string | null;
  descActividad: string | null;
  nombreComercial: string | null;
  direccion: NRE_Addres | null;
  telefono: string;
  correo: string;
}

export interface NRE_CuerpoDocumento {
  numItem: number;
  tipoItem: number;
  numeroDocumento: string | null;
  codigo: string;
  codTributo: string | null;
  descripcion: string;
  cantidad: number;
  uniMedida: number;
  precioUni: number;
  montoDescu: number;
  ventaNoSuj: number;
  ventaExenta: number;
  ventaGravada: number;
  tributos: [] | null;
}

export interface NRE_Resumen {
  totalNoSuj: number;
  totalExenta: number;
  totalGravada: number;
  subTotalVentas: number;
  descuNoSuj: number;
  descuExenta: number;
  descuGravada: number;
  porcentajeDescuento: number | null;
  totalDescu: number;
  subTotal: number;
  totalIva: number;
  totalPagar: number;
  montoTotalOperacion: number;
  totalLetras: string;
  tributos:
    | {
        codigo: string;
        valor: number;
        descripcion: string;
      }[]
    | null;
}

export interface NRE_Extension {
  nombEntrega: string;
  docuEntrega: string;
  nombRecibe: string;
  docuRecibe: string;
  observaciones: string;
}

export interface NRE_Apendice {
  campo: string;
  etiqueta: string;
  valor: string;
}

export interface NRE_Venta_Terceros {
  nit: string;
  nombre: string;
}
