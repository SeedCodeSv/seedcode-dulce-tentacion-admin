import { Box } from "./box.types";
import { Customer } from "./report_contigence";

export interface SalesCcf {
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
	ivaRete1: string
	reteRenta: string;
	ivaPerci1: string;
	montoTotalOperacion: string;
	totalPagar: string;
	totalLetras: string;
	pathPdf: string;
	pathJson: string;
	isActivated: boolean;
	box: Box;
	customer: Customer;
	boxId: number;
	customerId: number;
	employeeId: number;
	salesStatusId?: any;
}

export interface Branch {
	id: number;
	name: string;
	address: string;
	phone: string;
	isActive: boolean;
	codEstableMH: string;
	codEstable: string;
	tipoEstablecimiento: string;
	transmitterId: number;
}

export interface PointOfSale {
	id: number;
	code: string;
	typeVoucher: string;
	description: string;
	resolution: string;
	serie: string;
	from: string;
	to: string;
	prev: number;
	next: number;
	codPuntoVentaMH?: any;
	codPuntoVenta: string;
	isActive: boolean;
	branch: Branch;
	branchId: number;
}

export interface Sale {
	id: number;
	numeroControl: string;
	codigoGeneracion: string;
	tipoDte: string;
	typeVoucher: string;
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
	box: Box;
	customer: Customer;
	totalPagar: string;
	totalLetras: string;
	pathPdf: string;
	pathJson: string;
	isActivated: boolean;
	paymentType: string;
	boxId: number;
	customerId: number;
	employeeId: number;
	salesStatusId: number;
}

export interface FacturacionCcfe {
	code: string;
	sales: Sale[];
	sales_facturacion: number;
}

export interface IGetSalesCCF {
	ok: boolean;
	totalFe: number;
	salesCcf: SalesCcf[];
	facturacionCcfe: FacturacionCcfe[];
	status: number;
}