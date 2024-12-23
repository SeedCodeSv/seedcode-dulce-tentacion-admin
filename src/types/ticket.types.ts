import { IPagination } from "./global.types";

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

export interface Employee {
	id: number;
	firstName: string;
	secondName: string;
	firstLastName: string;
	secondLastName: string;
	bankAccount: string;
	nit: string;
	dui: string;
	isss: string;
	afp: string;
	code: string;
	phone: string;
	age: number;
	salary: string;
	dateOfBirth: string;
	dateOfEntry: string;
	dateOfExit?: any;
	responsibleContact: string;
	isActive: boolean;
	chargeId: number;
	branchId: number;
	employeeStatusId: number;
	studyLevelId: number;
	contractTypeId: number;
	addressId: number;
}

export interface Transmitter {
    id: number;
    clavePrivada: string;
    clavePublica: string;
    nit: string;
    nrc: string;
    nombre: string;
    telefono: string;
    correo: string;
    descActividad: string;
    codActividad: string;
    nombreComercial: string;
    tipoEstablecimiento: string;
    codEstableMH: string;
    codEstable: string;
    codPuntoVentaMH: string;
    codPuntoVenta: string;
    claveApi: string;
    tipoContribuyente: string | null;
    active: boolean;
    direccionId: number;
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
	transmitter: Transmitter;
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
	correlative: Correlative;
	correlativeId: number;
	pointOfSaleId?: any;
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
	totalPagar: string;
	totalLetras: string;
	pathPdf: string;
	pathJson: string;
	isActivated: boolean;
	paymentType?: any;
	customer: Customer;
	employee: Employee;
	box: Box;
	boxId: number;
	customerId: number;
	employeeId: number;
	salesStatusId: number;
}

export interface GetTicketsResponse extends IPagination {
	sales: Sale[];
	totalSales: number;
}

// export interface GetDetailTicket {
// 	ok: boolean;
// 	detailSale: Sale;
// 	status: number;
// }

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
	subCategoryId: number;
}

export interface BranchProduct {
	id: number;
	stock: number;
	price: string;
	priceA: string;
	priceB: string;
	priceC: string;
	minimumStock: number;
	costoUnitario: string;
	isActive: boolean;
	product: Product;
	branchId: number;
	productId: number;
	supplierId?: any;
}

export interface DetailSale {
	id: number;
	montoDescu: string;
	ventaNoSuj: string;
	ventaExenta: string;
	ventaGravada: string;
	totalItem: string;
	cantidadItem: number;
	isActive: boolean;
	branchProduct: BranchProduct;
	sale: Sale;
	saleId: number;
	branchProductId: number;
}

export interface GetDetailTicket {
	ok: boolean;
	status: number;
	message: string;
	detailSale: DetailSale[];
}