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

export interface Correlative {
	id: number;
	code: string;
	typeVoucher: string;
	resolution: string;
	serie: string;
	from: string;
	to: string;
	prev: number;
	next: number;
	isActive: boolean;
	branch: Branch;
	branchId: number;
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
	pointOfSale?: any;
	correlative: Correlative;
	correlativeId: number;
	pointOfSaleId?: any;
}

export interface Customer {
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
	direccionId: number;
	branchId: number;
}

export interface SaleAnnexe {
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
	totalPagar: string;
	totalLetras: string;
	pathPdf: string;
	pathJson: string;
	isActivated: boolean;
	paymentType?: any;
	box: Box;
	customer: Customer;
	boxId: number;
	customerId: number;
	employeeId: number;
	salesStatusId?: any;
}

export interface IGetAnnexesCcf {
	ok: boolean;
	sales: SaleAnnexe[];
	status: number;
}