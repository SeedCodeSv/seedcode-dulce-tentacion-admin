export interface ISendMHFiscal {
  nit: string;
  activo: boolean;
  passwordPri: string;
  dteJson: DteJson;
}
export interface DteJson {
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
  nit: string | null;
  nrc: null | string;
  nombre: null | string;
  codActividad: null | string;
  descActividad: null | string;
  direccion: Direccion;
  telefono: null | string;
  correo: string;
  bienTitulo?: string | null;
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
  totalIva: number | string;
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
export interface CreditSale {
  id: number;
  numeroControl: string;
  codigoGeneracion: string;
  tipoDte: string;
  fecEmi: string;
  horEmi: string;
  selloRecibido: string;
  sello: boolean;
  codeEmployee: string;
  totalNoSuj: string;
  totalExenta: string;
  totalGravada: string;
  subTotalVentas: string;
  descuNoSuj: string;
  descuExenta: string;
  descuGravada: string;
  porcentajeDescuento: string;
  totalDescu: string;
  subTotal: string;
  totalIva: string;
  montoTotalOperacion: string;
  totalPagar: string;
  totalLetras: string;
  pathPdf: string;
  pathJson: string;
  isActivated: boolean;
  boxId: number;
  customerId: any;
  employeeId: number;
  paymentTypeId: any;
}
