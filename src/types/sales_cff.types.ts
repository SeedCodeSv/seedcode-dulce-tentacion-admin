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

export interface IGetSalesCCF {
	ok: boolean;
	totalFe: number;
	salesCcf: SalesCcf[];
	status: number;
}