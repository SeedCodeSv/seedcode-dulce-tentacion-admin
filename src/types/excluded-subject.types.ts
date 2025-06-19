import { IExcludedSubjects } from "./excluded_subjects.types"
import { ISalesStatus } from "./sales_status.types"
import { Supplier } from "./supplier.types"

export interface SaleEmployee {
  branch: {
    id: number
    name: string
    address: string
    phone: string
    codEstableMH: string
    codEstable: string
    tipoEstablecimiento: string
    isActive: boolean
    transmitter: {
      id: number
      clavePrivada: string
      clavePublica: string
      claveApi: string
      nit: string
      nrc: string
      nombre: string
      telefono: string
      correo: string
      descActividad: string
      codActividad: string
      nombreComercial: string
      tipoContribuyente: string
      active: boolean
      direccionId: number
    }
    transmitterId: number
  }
}

export interface IExcludedSubJects {
  id: number
  paymentType: string
  numeroControl: string
  codigoGeneracion: string
  tipoDte: string
  fecEmi: string
  horEmi: string
  selloRecibido: string
  selloInvalidacion: string
  sello: boolean
  codeEmployee: string
  totalNoSuj: string
  totalExenta: string
  totalGravada: string
  subTotalVentas: string
  descuNoSuj: string
  descuExenta: string
  descuGravada: string
  porcentajeDescuento: string
  totalDescu: string
  subTotal: string
  totalIva: string
  montoTotalOperacion: string
  totalCompra: string,
  totalPagar: string
  reteRenta: string
  totalLetras: string
  pathPdf: string
  pathJson: string
  isActivated: boolean
  employee: SaleEmployee
  box: Box
  subject: Supplier
  status: ISalesStatus
  boxId: number
  subjectId: number
  employeeId: number
  statusId: number

  details: Detail[]
  selloInvalidation: string
}

export interface Box {
  id: number
  start: string
  end: string
  totalSales: string
  totalExpense: string
  totalIva: string
  date: string
  time: string
  isActive: boolean
  pointOfSaleId: number
}

export interface IGetExcludedSubjectPaginated {
  ok: boolean
  excludedSubjects: IExcludedSubjects[]
  total: number
  totalPag: number
  currentPag: number
  nextPag: number
  prevPag: number
  status: number
}

//para anular

export interface IExSubject {
  id: number
  pathJson: string
  excludedSj: {
    id: number
  }
}
export interface IGetExcludedSubject {
  ok: boolean
  status: number
  excludedSubjects: IExSubject
}

export interface IRecentExcludedSubject {
  ok: boolean
  status: number
  excludedSubjects: IExcludedSubjects[]
}

export interface IGetExcludedSubjectDetails {
  ok: boolean
  message: string
  excludedSubject: IExcludedSubjects
}

export interface Detail {
  id: number
  tipoItem: number
  cantidad: number
  uniMedida: number
  descripcion: string
  codigo?: string
  precioUni: number
  montoDescu: number
  compra: number
  excludedSubject: IExcludedSubjects
  excludedSubjectId: number
  pathPdf: string
  pathJson: string
  isActive: boolean
  isEdited: boolean
}
export interface AnnulationExcludedSubjectPayload {
  nameResponsible: string
  nameApplicant: string
  docNumberResponsible: string
  docNumberApplicant: string
  typeDocResponsible: string
  typeDocApplicant: string
}

export interface ExcludedSubjectByMonthBranch {
  ok: boolean
  excludedSubject: IExcludedSubjects[]
  status: number
}


export interface ExcludedSubject {
  id: number
  numeroControl: string
  codigoGeneracion: string
  tipoDte: string
  pathJson: string
  condicionOperacion: number
  fecEmi: string
  horEmi: string
  selloRecibido: string
  selloInvalidacion: any
  sello: boolean
  totalCompra: string
  descu: string
  totalDescu: string
  ivaRete1: string
  subTotal: string
  reteRenta: string
  totalPagar: string
  totalLetras: string
  isActive: boolean
  // subject: Subject
  subjectId: number
  boxId: number
  employeeId: number
  statusId: number
}
