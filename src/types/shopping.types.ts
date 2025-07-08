import { Dispatch, SetStateAction } from "react"

import { ClassDocumentCode, ClassDocumentValue, ClassificationCode, ClassificationValue, OperationTypeCode, OperationTypeValue, SectorCode, SectorValue, TypeCostSpentCode, TypeCostSpentValue } from "@/enums/shopping.enum"
import { BasicResponse } from "./global.types"

// export interface ICreateShopping {
//   branchId: number
//   json?: File | Blob | null
// }

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
  transmitterId: number
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
  codCuenta: string;
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
  totalCompra: string;
  pathPdf: string;
  pathJson: string;
  isActivated: boolean;
  branchId: number;
  supplierId: number;
  supplier: Supplier;
  typeSale: "Interna" | "Internacion" | "Importacion"
  ivaPerci1: number
  tributes: Tributes[],
  iva: Tributes[],
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
  id: number;
  codigo: string;
  valores: string;
  value: number;
  shoppingId: number;
}


export interface IGetShoppingReport {
  ok: boolean;
  shoppings: ShoppingReport[];
  status: number;
}

export interface ItemDetails {
  id: number
  numberItem: string
  conceptOfTheTransaction: string
  should: number,
  see: number,
  isActive: boolean,
  accountCatalogId: number
  branchId: number | null,
  itemId: number,
  accountCatalog: {
    id: number;
    code: string
    name: string
    majorAccount: string
    accountLevel: string
    accountType: string
    uploadAs: string
    subAccount: boolean
    item: string
    isActive: boolean
  }
}

export interface ShoppingDetails extends ShoppingReport {
  item: {
    id: number;
    noPartida: number;
    date: string;
    concepOfTheItem: string;
    totalDebe: string;
    totalHaber: string;
    difference: string;
    isActive: boolean;
    typeOfAccountId: number;
    transmitterId: number;
    itemsDetails: ItemDetails[]
  }
}

export interface IGetShoppingDetails {
  ok: boolean,
  compra: ShoppingDetails,
  status: number
}

export interface ISupplier {
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
  isActive?: boolean | undefined;
  esContribuyente: number | boolean;
  tipoContribuyente?: any;
  direccionId?: number | undefined;
  codCuenta: string
}

export interface GeneralInfoProps {
  tipoDte: string;
  setTipoDte: (tipoDte: string) => void;
  correlative: number;
  nrc: string;
  setNrc: (nrc: string) => void;
  includePerception: boolean;
  setIncludePerception: (includePerception: boolean) => void;
  supplierSelected: ISupplier | undefined;
  setSupplierSelected: (supplierSelected: ISupplier | undefined) => void;
  setSearchNRC: (searchNRC: string) => void;
  setBranchName: Dispatch<SetStateAction<string>>;
}

export interface IGetProductShoppingReport extends BasicResponse{
  detailsShopping: DetailShopping[]
}

export interface DetailShopping {
  shopping: ShoppingReport;
  shoppingId: number;
  precioUni: number;
  descripcion: string;
  id: number;
  montoDescu: number;
  ventaNoSuj: number;
  ventaExenta: number;
  ventaGravada: number;
  totalItem: number;
  uniMedida: string
  isActive: boolean;
}
