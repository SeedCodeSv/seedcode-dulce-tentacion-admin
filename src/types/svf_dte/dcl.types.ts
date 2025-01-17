export interface SVFE_DCL {
    identificacion: DCL_Identificacion;
    emisor: DCL_Emisor;
    receptor: DCL_Receptor;
    cuerpoDocumento: DCL_CuerpoDocumento;
    extension: DCL_Extension;
    apendice: DCL_Apendice[] | null;
    sello: string;
    selloRecibido: string
    documento: string;
  }
  
  export interface DCL_Apendice {
    campo: string;
    etiqueta: string;
    valor: string;
  }
  
  export interface DCL_Identificacion {
    version: number;
    ambiente: string;
    tipoDte: string;
    numeroControl: string;
    codigoGeneracion: string;
    tipoModelo: number;
    tipoOperacion: number;
    fecEmi: string;
    horEmi: string;
    tipoMoneda: string;
  }
  
  export interface DCL_Emisor {
    nit: string;
    nrc: string;
    nombre: string;
    codActividad: string;
    descActividad: string;
    nombreComercial: string;
    tipoEstablecimiento: string;
    telefono: string;
    correo: string;
    direccion: Direccion;
    codigoMH: string;
    codigo: string | null;
    puntoVentaMH: string;
    puntoVentaContri: string | null;
  }
  
  export interface Direccion {
    departamento: string;
    municipio: string;
    complemento: string;
  }
  
  export interface DCL_Receptor {
    nit: string;
    nrc: string;
    nombre: string;
    codActividad: string;
    descActividad: string;
    nombreComercial: string;
    tipoEstablecimiento: string;
    direccion: Direccion;
    telefono: string | null;
    correo: string;
    codigoMH: string | null;
    puntoVentaMH: string | null;
  }
  
  
  export interface DCL_CuerpoDocumento {
    periodoLiquidacionFechaInicio: string;
    periodoLiquidacionFechaFin: string;
    valorOperaciones: number;
    codLiquidacion: string;
    cantidadDoc: number;
    descripSinPercepcion: string;
    subTotal: number;
    iva: number;
    montoSujetoPercepcion: number;
    ivaPercibido: number;
    comision: number;
    porcentComision: number;
    ivaComision: number;
    liquidoApagar: number;
    montoSinPercepcion: number;
    totalLetras: string;
    observaciones: string;
  }
  
  export interface DCL_Extension {
    nombEntrega: string;
    docuEntrega: string;
    codEmpleado: string | null;
  }
  