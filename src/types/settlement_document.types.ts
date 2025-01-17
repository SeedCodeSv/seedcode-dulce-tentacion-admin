import { IPagination } from "./global.types";

export interface PostSettlementDocumentResponse {
  status: number;
  message: string;
  supplierError: boolean;
  ok: boolean;
}

export interface PostSettlementDocumentPayload {
  jsonPath: string;
  transmitterId: number;
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
	direccionId: number;
	transmitterId: number;
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
	tipoContribuyente?: any;
	active: boolean;
	direccionId: number;
}

export interface SettlementDocument {
	id: number;
	numeroControl: string;
	codigoGeneracion: string;
	fecEmi: string;
	horEmi: string;
	periodoLiquidacionFechaInicio: string;
	periodoLiquidacionFechaFin: string;
	valorOperaciones: string;
	codLiquidacion: string;
	cantidadDoc: number;
	descripSinPercepcion: string;
	subTotal: string;
	iva: string;
	montoSujetoPercepcion: string;
	ivaPercibido: string;
	comision: string;
	porcentComision: string;
	ivaComision: string;
	liquidoApagar: string;
	montoSinPercepcion: string;
	totalLetras: string;
	observaciones: string;
	nombEntrega: string;
	docuEntrega: string;
	codEmpleado?: any;
	sello: string;
	pathJson: string;
	supplier: Supplier;
	transmitter: Transmitter;
	supplierId: number;
	transmitterId: number;
}

export interface GetSettlementDocument extends IPagination {
	settlementDocuments: SettlementDocument[];
}