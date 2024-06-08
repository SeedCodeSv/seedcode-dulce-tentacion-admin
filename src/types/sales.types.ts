import { Employee } from './employees.types';
import { Customer, Direccion } from './report_contigence';

export interface IGetSales {
  ok: boolean;
  sales: Sale[];
  totalPag: number;
  total: number;
  currentPag: number;
  nextPag: number;
  status: number;
  prevPag: number;
}

interface Sale {
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
  customerId: number;
  customer: Customer;
  employee: Employee;
  direccion: Direccion;
  employeeId: number;
  selloInvalidation: string;
  salesStatusId: number;
  salesStatus: SaleStatus;
}

interface SaleStatus {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Product {
	id: number;
	name: string;
	description: string;
	tipoItem: string;
	tipoDeItem: string;
	uniMedida: string;
	unidaDeMedida: string;
	code: string;
	isActive: boolean;
	categoryProductId: number;
}

export interface BranchProduct {
	id: number;
	stock: number;
	price: number;
	newPrice: number;
	priceA: number;
	priceB: number;
	priceC: number;
	minimumStock: number;
	costoUnitario: string;
	isActive: boolean;
	product: Product;
	branchId: number;
	productId: number;
	supplierId?: any;
}

export interface Detail {
	id: number;
	montoDescu: number;
	porcentajeDescuento: number;
	newPorcentajeDescu: number;
	ventaNoSuj: number;
	ventaExenta: number;
	ventaGravada: number;
	totalItem: number;
	mewTotal: number;
	newMontoDescu: number;
	newCantidadItem: number;
	newTotalItem: number;
	cantidadItem: number;
	isActive: boolean;
	branchProduct: BranchProduct;
	saleId: number;
	branchProductId: number;
}

export interface SaleDetails {
	id: number;
	paymentType: string;
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
	customer: Customer;
	boxId: number;
	customerId: number;
	employeeId: number;
	salesStatusId: number;
	details: Detail[];
	isEdited: boolean;
}

export interface IGetSaleDetails {
	ok: boolean;
	message: string;
	sale: SaleDetails;
}