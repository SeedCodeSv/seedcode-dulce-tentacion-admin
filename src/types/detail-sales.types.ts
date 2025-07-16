export interface GetSaleDetails {
  ok: boolean
  sale: Sale
}

export interface Sale {
  id: number
  paymentType: string
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
  ivaRete1: string
  reteRenta: string
  ivaPerci1: string
  incomeTypeCode: string
  incomeTypeValue: string
  operationTypeRentaCode: string
  operationTypeRentaValue: string
  amountReceived: string
  change: string
  salesStatus: SalesStatus
  employee: Employee
  box: Box
  detailSales: DetailSale[]
  payments: Payment[]
  boxId: number
  customerId: number
  employeeId: number
  salesStatusId: number
}

export interface SalesStatus {
  id: number
  name: string
  isActive: boolean
}

export interface Employee {
  id: number
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  bankAccount: string
  nit: string
  dui: string
  isss: string
  afp: string
  code: string
  phone: string
  age: number
  codeCutZ: string
  codeReferal: string
  salary: string
  dateOfBirth: string
  dateOfEntry: string
  dateOfExit: any
  responsibleContact: string
  isActive: boolean
  isResponsibleCutZ: boolean
  branch: Branch
  chargeId: number
  branchId: number
  employeeStatusId: number
  studyLevelId: number
  contractTypeId: number
  addressId: number
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
  transmitter: Transmitter
  transmitterId: number
}

export interface Transmitter {
  id: number
  clavePrivada: string
  clavePublica: string
  nit: string
  nrc: string
  nombre: string
  telefono: string
  correo: string
  descActividad: string
  codActividad: string
  nombreComercial: string
  tipoEstablecimiento: string
  codEstableMH: string
  codEstable: string
  codPuntoVentaMH: string
  codPuntoVenta: string
  claveApi: string
  tipoContribuyente: string
  active: boolean
  direccionId: number
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
  branch: Branch2
  branchId: number
}

export interface Branch2 {
  id: number
  name: string
  address: string
  phone: string
  isActive: boolean
  codEstableMH: string
  codEstable: string
  tipoEstablecimiento: string
  transmitter: Transmitter2
  transmitterId: number
}

export interface Transmitter2 {
  id: number
  clavePrivada: string
  clavePublica: string
  nit: string
  nrc: string
  nombre: string
  telefono: string
  correo: string
  descActividad: string
  codActividad: string
  nombreComercial: string
  tipoEstablecimiento: string
  codEstableMH: string
  codEstable: string
  codPuntoVentaMH: string
  codPuntoVenta: string
  claveApi: string
  tipoContribuyente: string
  active: boolean
  direccionId: number
}

export interface DetailSale {
  id: number
  montoDescu: string
  ventaNoSuj: string
  ventaExenta: string
  ventaGravada: string
  totalItem: string
  cantidadItem: number
  isActive: boolean
  branchProduct: BranchProduct
  saleId: number
  branchProductId: number
}

export interface BranchProduct {
  id: number
  stock: string
  retainedProducts: number
  price: string
  priceA: string
  priceB: string
  priceC: string
  minimumStock: number
  costoUnitario: string
  isActive: boolean
  product: Product
  branchId: number
  productId: number
}

export interface Product {
  id: number
  name: string
  description: string
  tipoItem: string
  tipoDeItem: string
  uniMedida: string
  unidaDeMedida: string
  code: string
  isActive: boolean
  isToDivided: boolean
  productType: string
  subCategoryId: number
}

export interface Payment {
  id: number
  code: string
  amount: string
  reference: string
  period: any
  deadline: any
  saleId: number
}
