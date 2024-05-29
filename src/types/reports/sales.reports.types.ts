import { Product } from "../products.types";

export interface SaleBranchMonth {
  branch: string;
  total: number;
}

export interface IGetSalesByBranchOfCurrentMonth {
  ok: boolean;
  sales: SaleBranchMonth[];
}

export interface SaleMonthYear {
  month: number;
  total: number;
}

export interface ProductoMostSelledTable {
  branchProduct: BranchProduct,
  quantity: number
  total: number
}

export interface BranchProduct {
  id: number;
  stock: number;
  price: number;
  branch: Branch;
  branchId?: number;
  product: Product;
  productId?: number;
  isActive: boolean;
}

export interface IGetSalesByMonthAndYear {
  ok: boolean;
  sales: SaleMonthYear[];
}

export interface IGetSalesByDay {
  ok: boolean;
  sales: number;
}
export interface IGetMostProductSelled {
  ok: boolean;
  products: ProductoMostSelledTable[];
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  transmitterId: number;
}

export interface Box {
  id: number;
  start: string;
  end: string;
  totalSales: string;
  totalExpense: string;
  totalIva: string;
  date: string;
  time: string;
  isActive: boolean;
  branch: Branch;
  branchId: number;
}

export interface SaleTableDay {
  id: number;
  numeroControl: string;
  codigoGeneracion: string;
  tipoDte: string;
  fecEmi: string;
  horEmi: string;
  selloRecibido: string;
  selloInvalidacion: string;
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
  box: Box;
  boxId: number;
  customerId: number;
  employeeId: number;
  salesStatusId?: number;
}

export interface IGetSalesByDayTable {
  ok: boolean;
  sales: SaleTableDay[];
}


export interface IResponseDataProductGrafic {
  ok: boolean;
  dataProduct: IDataProductGrafic[];
}

export interface IDataProductGrafic {
  productName: string
  quantity: string
  total: string
}
