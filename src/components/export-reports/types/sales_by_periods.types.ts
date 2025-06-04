export interface RespSalesByPeriods {
  ok: boolean
  message: string
  sales: SaleByPeriod[]
}

export interface SaleByPeriod {
  id: number
  numeroControl: string
  codigoGeneracion: string
  tipoDte: string
  typeVoucher: string
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
  totalPagar: string
  totalLetras: string
  pathPdf: string
  pathJson: string
  isActivated: boolean
  paymentType: string
  box: Box
  boxId: number
  customerId: number
  employeeId: number
  salesStatusId: number
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
  pointOfSale: PointOfSale
  pointOfSaleId: number
}

export interface PointOfSale {
  id: number
  code: string
  typeVoucher: string
  description: string
  resolution: string
  serie: string
  from: string
  to: string
  prev: number
  next: number
  codPuntoVentaMH: any
  codPuntoVenta: string
  isActive: boolean
  branch: Branch
  branchId: number
}

export interface Branch {
  id: number
  name: string
  address: string
  phone: string
  isActive: boolean
  codEstableMH: string
  codEstable: string
  tipoEstablecimiento: string
  transmitterId: number
}


export interface ResponseDetailsReport {
  ok: boolean
  sales: SaleDetailsReport[]
  total: number
  totalSales: number
  countSales: number
  currentPag: number
  nextPag: number
  prevPag: number
  status: number
}

export interface SaleDetailsReport {
  id: number
  numeroControl: string
  montoTotal: number
  fecEmi: string
  branch: string
}
