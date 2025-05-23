export interface ISendMHFiscal {
  nit: string;
  activo: boolean;
  passwordPri: string;
  dteJson: DteJson;
}

export interface DteJson {
  nit: string;
  activo: boolean;
  passwordPri: string;
  dteJson: JSONSend;
}

export interface JSONSend {
  identificacion: Identificacion;
  documentoRelacionado?: any;
  emisor: Emisor;
  receptor: Receptor;
  otrosDocumentos: any;
  ventaTercero: any;
  cuerpoDocumento: ICuerpoDocumento[];
  resumen: Resumen;
  extension: any;
  apendice: any;
}

export interface RootDTE {
  identificacion: Identificacion;
  documentoRelacionado: null | string;
  emisor: Emisor;
  receptor: Receptor;
  otrosDocumentos: null | string;
  ventaTercero: null | string;
  cuerpoDocumento: ICuerpoDocumento[];
  resumen: Resumen;
  extension: Extension;
  apendice: null | string;
  firmaElectronica: string;
  selloRecibido: string;
}

export interface IDTE {
  identificacion: Identificacion;
  documentoRelacionado: null | string;
  emisor: Emisor;
  receptor: Receptor;
  otrosDocumentos: null | string;
  ventaTercero: null | string;
  cuerpoDocumento: ICuerpoDocumento[];
  resumen: Resumen;
  extension: Extension;
  apendice: null | string;
  respuestaMH: RespuestaMH;
  firma: string;
}

export interface Identificacion {
  version: number;
  ambiente: string;
  tipoDte: string;
  numeroControl: string;
  codigoGeneracion: string;
  tipoModelo: number;
  tipoOperacion: number;
  tipoContingencia: null | string;
  motivoContin: null | string;
  fecEmi: string;
  horEmi: string;
  tipoMoneda: string;
}

export interface Emisor {
  nit: string;
  nrc: string;
  nombre: string;
  codActividad: string;
  descActividad: string;
  nombreComercial: string;
  tipoEstablecimiento: string;
  direccion: Direccion;
  telefono: string;
  correo: string;
  codEstableMH: string | null;
  codEstable: string | null;
  codPuntoVentaMH: string | null;
  codPuntoVenta: string | null;
}

export interface Direccion {
  departamento: string;
  municipio: string;
  complemento: string;
}

export interface Receptor {
  tipoDocumento: null | string;
  numDocumento: null | string;
  nrc: null | string;
  nit?: string | null;
  nombre: null | string;
  codActividad: null | string;
  descActividad: null | string;
  direccion: Direccion;
  telefono: null | string;
  correo: string;
  bienTitulo?: string | null;
}

export interface FiscalReceptor {
  nit: string;
  nrc: string;
  nombre: string;
  codActividad: string;
  descActividad: string;
  nombreComercial: string;
  direccion: {
    departamento: string;
    municipio: string;
    complemento: string;
  };
  telefono: string;
  correo: string;
}

export interface IProductVista {
  cantidad: number;
  codigo: string;
  descripcion: string;
  precioUni: number;
  numItem: number;
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
}

export interface Resumen {
  totalNoSuj: number | string;
  totalExenta: number | string;
  totalGravada: number | string;
  subTotalVentas: number | string;
  descuNoSuj: number | string;
  descuExenta: number | string;
  descuGravada: number | string;
  porcentajeDescuento: number | string;
  totalDescu: number | string;
  tributos:
    | null
    | {
        codigo: string;
        descripcion: string;
        valor: number;
      }[];
  subTotal: number | string;
  ivaRete1: number | string;
  reteRenta: number | string;
  montoTotalOperacion: number | string;
  totalNoGravado: number | string;
  totalPagar: number | string;
  totalLetras: string;
  saldoFavor: number | string;
  condicionOperacion: number;
  pagos: Pago[];
  numPagoElectronico: string | null;
}

export interface Pago {
  codigo: string;
  montoPago: number;
  referencia: null | string;
  plazo?: null | string;
  periodo?: null | string;
}

export interface Extension {
  nombEntrega: null | string;
  docuEntrega: null | string;
  nombRecibe: null | string;
  docuRecibe: null | string;
  observaciones: null | string;
  placaVehiculo: null | string;
}

export interface PayloadMH {
  ambiente: string;
  idEnvio: number;
  version: number;
  tipoDte: string;
  documento: string;
}

export interface DTEToPDF {
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
  emisor: Emisor;
  receptor: Receptor;
  resumen: Resumen;
  numeroControl: string;
  cuerpoDocumento: ICuerpoDocumento[];
}

export interface IMHToken {
  sub: string;
  authorities: string[];
  iat: number;
  exp: number;
}

export interface RespuestaMH {
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
  observaciones: any[];
}
