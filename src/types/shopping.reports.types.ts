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
	direccionId: number;
	transmitterId: number;
}

export interface ShoppingReport {
	id: number;
	controlNumber: string;
	generationCode: string;
	correlative: number;
	typeDte: string;
	fecEmi: string;
	horEmi: string;
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
	supplier: Supplier;
	branchId: number;
	supplierId: number;
}

export interface IGetShoppingReport {
	ok: boolean;
	shoppings: ShoppingReport[];
	status: number;
}