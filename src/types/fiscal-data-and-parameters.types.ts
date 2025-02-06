export interface GetFiscalDataAndParameter {
    ok: boolean
    status: number
    fiscalDataAndParameter: FiscalDataAndParameter
}

export interface FiscalDataAndParameter {
    id: number
    ivaLocalShopping: string
    ivaImports: string
    ivaTributte: string
    ivaFinalConsumer: string
    ivaRete1: string
    ivaPerci1: string
    ivaCard2: string
    generalBox: string
    cardCredit: string
    indiferenceExpenseF: string
    cescOrTurismShoppping: string
    cescOrTurismSales: string
    advancesCXC: string
    transientAdvancesCXD: string
    isActive: boolean
    transmitter: Transmitter
    transmitterId: number
}

export interface Transmitter {
    id: number
    clavePrivada: string
    clavePublica: string
    nit: string
    nrc: string
    nombre: string
    telefono: string
    correo: string
    descActividad: string
    codActividad: string
    nombreComercial: string
    tipoEstablecimiento: string
    codEstableMH: string
    codEstable: string
    codPuntoVentaMH: string
    codPuntoVenta: string
    claveApi: string
    tipoContribuyente: any
    active: boolean
    direccionId: number
}

export interface FiscalDataAndParameterPayload {
    ivaLocalShopping: string,
    ivaImports: string,
    ivaTributte: string,
    ivaFinalConsumer: string,
    ivaRete1: string,
    ivaPerci1: string,
    ivaCard2: string,
    generalBox: string,
    cardCredit: string,
    indiferenceExpenseF: string,
    cescOrTurismShoppping: string,
    cescOrTurismSales: string,
    advancesCXC: string,
    transientAdvancesCXD: string,
    transmitterId: number
}