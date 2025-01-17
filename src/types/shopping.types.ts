import { ClassDocumentCode, ClassDocumentValue, ClassificationCode, ClassificationValue, OperationTypeCode, OperationTypeValue, SectorCode, SectorValue, TypeCostSpentCode, TypeCostSpentValue } from "@/enums/shopping.enum"

export interface ICreateShopping {
  branchId: number
  json?: File | Blob | null
}

export interface ICreateShoppingManual {
  branchId: number
  fecEmi: string
  horEmi: string
  numeroControl: string
  codigoGeneracion: string
  tipoDte: string
  totalNoSuj: number
  totalExenta: number
  totalGravada: number
  subTotalVentas: number
  descuNoSuj: number
  descuExenta: number
  descuGravada: number
  porcentajeDescuento: number
  totalDescu: number
  subTotal: number
  totalIva: number
  montoTotalOperacion: number
  totalPagar: number
  totalLetras: string
  details: Detail[]
}
export interface IGetShoppingReportByCode {
	ok: boolean;
	shopping: ShoppingReport | null;
	status: number;
}


export interface Detail {
  descripcion: string
  montoDescu: number
  ventaNoSuj: number
  ventaExenta: number
  ventaGravada: number
  totalItem: number
}

export interface IShoppinStore {
  OnCreateShopping: (payload: ICreateShopping) => void
}

export interface IGetShoppingPaginated {
  ok: boolean
  compras: IGetShopping[]
  total: number
  totalPag: number
  currentPag: number
  nextPag: number
  prevPag: number
  status: number
}

export interface IGetShopping {
  id: number
  controlNumber: string
  generationCode: string
  typeDte: string
  fecEmi: string
  horEmi: string
  correlative: number
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
  branch: Branch
  branchId: number
  supplierId: number
}

export interface Branch {
  id: number
  name: string
  address: string
  phone: string
  isActive: boolean
  transmitterId: number
}

export interface CreateShoppingDto {
  branchId: number
  supplierId: number
  numeroControl: string
  tipoDte: string
  totalExenta?: number
  totalGravada?: number
  descuExenta?: number
  porcentajeDescuento?: number
  totalDescu?: number
  subTotal: number
  totalIva?: number
  montoTotalOperacion: number
  totalPagar: number
  totalLetras: string
  fecEmi: string;
  ivaPerci1: number
  correlative?: number
  operationTypeCode: OperationTypeCode,
  operationTypeValue: OperationTypeValue,
  classificationCode: ClassificationCode,
  classificationValue: ClassificationValue,
  sectorCode: SectorCode,
  sectorValue: SectorValue,
  typeCostSpentCode: TypeCostSpentCode,
  typeCostSpentValue: TypeCostSpentValue,
  declarationDate?: string
  typeSale?: string
  classDocumentCode: ClassDocumentCode,
  classDocumentValue: ClassDocumentValue,
}


export interface IGetCorrelativeShopping {
  ok: boolean
  correlative: number
  status: number
}

export interface ErrorSupplier {
  errorMessage: string
  supplier: boolean
  ok: boolean
}

export interface SuccessSupplier {
  ok: boolean
  status: number
  message: string
}

export interface Supplier {
  id: number;
  nombre: string;
  nombreComercial: string;
  nrc: string;
  nit: string;
  tipoDocumento: string;
  numDocumento: string;
  codActividad: string;
  descActividad: string;
  bienTitulo: string;
  telefono: string;
  correo: string;
  isActive: boolean;
  esContribuyente: boolean;
  tipoContribuyente?: any;
  direccionId: number;
  transmitterId: number;
}

export interface ShoppingIva {
  id: number,
  codigo: string,
  monto: number,
  shoppingId: number

}
export interface ShoppingReport {
	id: number;
	controlNumber: string;
	generationCode: string;
	typeDte: string;
	fecEmi: string;
	horEmi: string;
	correlative: number;
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
	branchId: number;
	supplierId: number;
  supplier:Supplier;
  typeSale: "Interna" | "Internacion" | "Importacion"
  ivaPerci1: number
  tributes: Tributes[],
  classDocumentCode: ClassDocumentCode,
  classDocumentValue: ClassDocumentValue,
  operationTypeCode: OperationTypeCode,
  operationTypeValue: OperationTypeValue,
  classificationCode: ClassificationCode,
  classificationValue: ClassificationValue,
  sectorCode: SectorCode,
  sectorValue: SectorValue,
  typeCostSpentCode: TypeCostSpentCode,
  typeCostSpentValue: TypeCostSpentValue,
  declarationDate?: string
}

interface Tributes {
  codigo: string, 
  valores: string,
  value: number
}
// export interface ShoppingReport {
//   id: number;
//   controlNumber: string;
//   generationCode: string;
//   typeDte: string;
//   fecEmi: string;
//   declarationDate: string,
//   horEmi: string;
//   correlative: number;
//   totalNoSuj: string;
//   totalExenta: string;
//   totalGravada: string;
//   subTotalVentas: string;
//   descuNoSuj: string;
//   descuExenta: string;
//   descuGravada: string;
//   porcentajeDescuento: string;
//   totalDescu: string;
//   subTotal: string;
//   totalIva: string;
//   montoTotalOperacion: string;
//   totalPagar: string;
//   totalLetras: string;
//   pathPdf: string;
//   pathJson: string;
//   ivaPerci1: string;
//   ivaRete1: string;
//   isActivated: boolean;
//   branchId: number;
//   supplierId: number;
//   supplier: Supplier;
//   typeSale: "Interna" | "Externa";
//   classDocumentCode: ClassDocumentCode,
//   classDocumentValue: ClassDocumentValue,
//   operationTypeCode: OperationTypeCode,
//   operationTypeValue: OperationTypeValue,
//   classificationCode: ClassificationCode,
//   classificationValue: ClassificationValue,
//   sectorCode: SectorCode,
//   sectorValue: SectorValue,
//   typeCostSpentCode: TypeCostSpentCode,
//   typeCostSpentValue: TypeCostSpentValue,
//   iva: ShoppingIva[],
//   branch: Branch
// }

export interface IGetShoppingReport {
  ok: boolean;
  shoppings: ShoppingReport[];
  status: number;
}

export interface  IGetShoppingDetails{
  ok: boolean,
  compra: ShoppingReport,
  status: number
}