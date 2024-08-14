
export interface IResponseFromDigitalOceanDTE {
  apendice: string | null
  documentoRelacionado: string | string[] | null
  extension: string | string[] | null
  cuerpoDocumento: CuerpoDocumento[],
  emisor: Emisor,
  identificacion: Identificacion,
  otrosDocumentos: string | string[] | null,
  receptor: Receptor,
  resumen: FC_Resumen,
  ventaTercero: string | string[] | null
}
export interface Identificacion {
  ambiente: string
  codigoGeneracion: string
  fecEmi: string
  horEmi: string
  motivoContin: null | string
  numeroControl: string
  tipoContingencia: null | string
  tipoDte: string
  tipoModelo: number
  tipoMoneda: string
  tipoOperacion: number
  version: number
}
export interface IReponseDigitalOcean {
  data: IResponseFromDigitalOceanDTE,
  status: number
  statusText: string
}
export interface Direccion {
    departamento: string
    municipio: string
    complemento: string
  }
  export interface Receptor {
    tipoDocumento: null | string
    numDocumento: null | string
    nit: string
    nrc: string
    nombre: string
    codActividad: string
    descActividad: string
    nombreComercial: string
    direccion: Direccion
    telefono: string
    correo: string
  }

  export interface Emisor {
    nit?: string
    nrc?: string
    numDocumento?: string
    tipoDocumento?: string
    nombre: string
    codActividad: string
    descActividad: string
    nombreComercial: string
    tipoEstablecimiento: string
    direccion: Direccion
    telefono: string
    correo: string
    codEstableMH: string | null
    codEstable: string | null
    codPuntoVentaMH: string | null
    codPuntoVenta: string | null
  }

  export interface CuerpoDocumento {
    numItem: number
    tipoItem: number
    uniMedida: number
    numeroDocumento: any
    cantidad: number
    codigo: string
    codTributo: any
    descripcion: string
    precioUni: number
    montoDescu: number
    ventaNoSuj: number
    ventaExenta: number
    ventaGravada: number
    tributos: string[] | null
    psv: number
    noGravado: number
    ivaItem: number
  }
  
  export interface FC_Resumen {
    totalNoSuj: number,
    totalExenta: number,
    totalGravada: number,
    subTotalVentas: number,
    descuNoSuj: number,
    descuExenta: number,
    descuGravada: number,
    porcentajeDescuento: number,
    totalDescu: number,
    tributos: FC_TributosItems[] | null,
    subTotal: number,
    ivaRete1: number,
    reteRenta: number,
    montoTotalOperacion: number,
    totalNoGravado: number,
    totalPagar: number,
    totalLetras: string,
    totalIva: number,
    saldoFavor: number
    condicionOperacion: number
    pagos: FC_PagosItems[] | null,
    numPagoElectronico: string | null
}

export interface FC_TributosItems {
    codigo: string,
    descripcion: string,
    valor: number
}

export interface FC_PagosItems{
    codigo: string,
    montoPago: number,
    referencia: string | null,
    plazo: string | null,
    periodo: number | null
}

  
