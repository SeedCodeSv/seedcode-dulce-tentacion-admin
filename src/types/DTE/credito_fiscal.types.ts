export interface Identificacion {
	version: number;
	codigoGeneracion: string;
	ambiente: string;
	tipoDte: string;
	numeroControl: string;
	tipoModelo: number;
	tipoOperacion: number;
	tipoContingencia?: any;
	motivoContin?: any;
	tipoMoneda: string;
	fecEmi: string;
	horEmi: string;
}

export interface Direccion {
	departamento: string;
	municipio: string;
	complemento: string;
}

export interface Emisor {
	nit: string;
	nrc: string;
	nombre: string;
	nombreComercial: string;
	codActividad: string;
	descActividad: string;
	tipoEstablecimiento: string;
	direccion: Direccion;
	telefono: string;
	correo: string;
	codEstable: string;
	codEstableMH?: any;
	codPuntoVenta: string;
	codPuntoVentaMH?: any;
}

export interface Direccion {
	departamento: string;
	municipio: string;
	complemento: string;
}

export interface Receptor {
	nit: string;
	nrc: string;
	nombre: string;
	codActividad: string;
	descActividad: string;
	nombreComercial: string;
	direccion: Direccion;
	telefono: string;
	correo: string;
}

export interface CuerpoDocumento {
	numItem: number | string;
	tipoItem: number | string;
	uniMedida: number | string;
	numeroDocumento?: any;
	cantidad: number | string;
	codigo: string;
	codTributo?: any;
	descripcion: string;
	precioUni: number | string;
	montoDescu: number | string;
	ventaNoSuj: number | string;
	ventaExenta: number | string;
	ventaGravada: number | string;
	tributos: string[] | null;
	psv: number | string;
	noGravado: number | string;
}

export interface Tributo {
	codigo: string;
	descripcion: string;
	valor: number;
}

export interface Pago {
	codigo: string;
	montoPago: number;
	referencia: string;
	plazo?: any;
	periodo?: any;
}

export interface Resumen {
	totalNoSuj: number | string;
	totalExenta: number | string;
	totalGravada: number | string;
	subTotalVentas: number | string;
	descuNoSuj: number | string;
	descuExenta: number | string;
	descuGravada: number | string;
	porcentajeDescuento: number | string;
	totalDescu: number | string;
	tributos: Tributo[];
	subTotal: number | string;
	ivaRete1: number | string;
	reteRenta: number | string;
	ivaPerci1: number | string;
	montoTotalOperacion: number | string;
	totalNoGravado: number | string;
	totalPagar: number | string;
	totalLetras: string;
	saldoFavor: number | string;
	condicionOperacion: number | string;
	pagos: Pago[];
	numPagoElectronico?: any;
}

export interface DteJson {
	identificacion: Identificacion;
	documentoRelacionado?: any;
	emisor: Emisor;
	receptor: Receptor;
	otrosDocumentos?: any;
	ventaTercero?: any;
	cuerpoDocumento: CuerpoDocumento[];
	resumen: Resumen;
	extension?: any;
	apendice?: any;
}

export interface ISendMHFiscal {
	nit: string;
	activo: boolean;
	passwordPri: string;
	dteJson: DteJson;
}

export interface DTEToPDFFiscal {
    version: number;
    ambiente: string;
    versionApp: number;
    estado: string;
    codigoGeneracion: string;
    selloRecibido: string;
    fhProcesamiento: string;
    clasificaMsg: string;
    codigoMsg: string;
    descripcionMsg: string;
    observaciones: string[];
    emisor: Emisor;
    receptor: Receptor;
    resumen: Resumen;
    numeroControl: string;
    cuerpoDocumento: CuerpoDocumento[];
  }