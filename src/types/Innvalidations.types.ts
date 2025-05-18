export interface Annulations{
  codigoGeneracion: string;
  numeroControl: string;
  selloRecibido: string;
  selloInvalidacion: string;
  employeeId: number;
  nombreSolicita: string;
  tipoDocumentoSolicita: string;
  numDocumentoSolicita: string;
  tipoDte: string;
  tipoAnulacion: string;
  fecAnula: string;
  horAnula: string;
  nombreResponsable: string;
  tipoDocumentoResponsable: string;
  numDocumentoResponsable: string;
}

export interface IGetInnvalidations {
  ok: boolean
  status: number
  innvalidations: Innvalidation[]
  total: number
  totalPag: number
  currentPag: number
  nextPag: number
  prevPag: number
}

export interface Innvalidation {
  id: number
  codigoGeneracion: string
  numeroControl: string
  selloRecibido: string
  selloInvalidacion: string
  nombreResponsable: string
  tipoDocumentoResponsable: string
  numDocumentoResponsable: string
  nombreSolicita: string
  tipoDocumentoSolicita: string
  numDocumentoSolicita: string
  tipoDte: string
  tipoAnulacion: string
  fecAnula: string
  horAnula: string
  sale: any
  notaRemision: NotaRemision
  sujetoExcluido: any
  employeeId: number
}

export interface NotaRemision {
  id: number
  numeroControl: string
  codigoGeneracion: string
  tipoDte: string
  fecEmi: string
  horEmi: string
  selloRecibido: string
  selloInvalidacion: string
  sello: boolean
  totalNoSuj: string
  totalExenta: string
  totalGravada: string
  subTotalVentas: string
  descuNoSuj: string
  descuExenta: string
  descuGravada: string
  porcentajeDescuento: string
  totalDescu: string
  tributos: string
  subTotal: string
  montoTotalOperacion: string
  totalPagar: string
  totalLetras: string
  EmployeeRequestCancelled: string
  observaciones: string
  nombreRecibe: string
  docRecibe: string
  descriptionCompleted: string
  pathJson: string
  isCompleted: boolean
  isActive: boolean
  branchId: number
  receivingBranchId: number
  customerId: any
  employeeId: number
  receivingEmployeeId: number
  statusId: number
}
