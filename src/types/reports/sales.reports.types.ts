import { Product } from '../products.types';

export interface SaleBranchMonth {
  branch: string;
  currentMonthSales: number;
  lastMonthSales: number;
}

export interface IGetSalesByBranchOfCurrentMonth {
  ok: boolean;
  sales: SaleBranchMonth[];
}

export interface SaleMonthYear {
  month: number;
  total: number;
}

export interface IDataExpenseReport {
  branch: string;
  total: number;
}
export interface ProductoMostSelledTable {
  branchProduct: BranchProduct;
  quantity: number;
  total: number;
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

export interface IResponseDataProductGrafic {
  ok: boolean;
  data: IDataProductGrafic[];
}

export interface IDataProductGrafic {
  productName: string;
  quantity: string;
  total: string;
}

export interface SaleTable {
  id: number;
  branch: string;
  numberOfSales: string;
  totalSales: string;
}

export interface IGetSalesByDayTable {
  ok: boolean;
  sales: SaleTable[];
}

export interface IGetSalesCount {
  ok: boolean;
  totalSales: number;
}

export interface ISaleCategoryProduct {
  categoryId: number;
  categoryName: string;
  totalItems: string;
}

export interface IGraphicForCategoryProductsForDates {
  ok: boolean;
  message: string;
  sales: ISaleCategoryProduct[];
  totalSales: number;
}

export interface GraphicSubCategory {
  subCategoryName: string;
  totalItems: string;
}

export interface IGraphicSubCategoryProductsForDates {
  ok: boolean;
  message: string;
  detailSales: GraphicSubCategory[];
  totalSales: number;
}

export interface SaleProduct {
  productName: string;
  totalItemSum: string;
}

export interface IGetSaleByProduct {
  ok: boolean;
  sales: SaleProduct[];
  totalSales: number;
}
