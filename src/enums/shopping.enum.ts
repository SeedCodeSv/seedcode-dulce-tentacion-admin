export enum OperationTypeCode {
    GRAVADA = '1',
    NO_GRAVADA_O_EXENTA = '2',
    EXCLUIDA_O_NO_CONSTITUYE_RENTA = '3',
    MIXTA = '4',
    EXCEPCIONES = '9',
}

export enum OperationTypeValue {
    Gravada = 'Gravada',
    No_gravada_o_exenta = 'No gravada o exenta',
    Excluido_o_no_constituye_renta = 'Excluido o no constituye renta',
    Mixta = 'Mixta (Contribuyentes que gozan de Regímenes Especiales con incentivos fiscales)',
    Excepciones = 'Excepciones (Instituciones públicas, no inscritos a IVA, operaciones no deducibles para renta, entre otros.)',
}

export const OperationTypes = [
    {
        code: OperationTypeCode.GRAVADA,
        value: OperationTypeValue.Gravada
    },
    {
        code: OperationTypeCode.NO_GRAVADA_O_EXENTA,
        value: OperationTypeValue.No_gravada_o_exenta
    },
    {
        code: OperationTypeCode.EXCLUIDA_O_NO_CONSTITUYE_RENTA,
        value: OperationTypeValue.Excluido_o_no_constituye_renta
    },
    {
        code: OperationTypeCode.MIXTA,
        value: OperationTypeValue.Mixta
    },
    {
        code: OperationTypeCode.EXCEPCIONES,
        value: OperationTypeValue.Excepciones
    }
]

export enum ClassificationCode {
    COSTO = '1',
    GASTO = '2',
    EXCEPCIONES = '9',
}

export enum ClassificationValue {
    Costo = 'Costo',
    Gasto = 'Gasto',
    Excepciones = 'Excepciones (Instituciones públicas, no inscritos a IVA, operaciones no deducibles para renta, entre otros.)',
}

export const Classifications = [
    {
        code: ClassificationCode.COSTO,
        value: ClassificationValue.Costo
    },
    {
        code: ClassificationCode.GASTO,
        value: ClassificationValue.Gasto
    },
    {
        code: ClassificationCode.EXCEPCIONES,
        value: ClassificationValue.Excepciones
    }
]

export enum SectorCode {
    INDUSTRIA = '1',
    COMERCIO = '2',
    AGROPECUARIA = '3',
    SERVICIOS_PROF_ART_OFF = '4',
    EXCEPCIONES = '9',
}

export enum SectorValue {
    INDUSTRIA = 'Industria',
    COMERCIO = 'Comercio',
    AGROPECUARIA = 'Agropecuaria',
    SERVICIOS_PROF_ART_OFF = 'Servicios, Profesiones, Artes y Oficios',
    EXCEPCIONES = 'Excepciones (Instituciones publicas, no inscritos a IVA, operaciones no deducibles para renta, entre otros.)',
}

export const Sectors = [
    {
        code: SectorCode.INDUSTRIA,
        value: SectorValue.INDUSTRIA
    },
    {
        code: SectorCode.COMERCIO,
        value: SectorValue.COMERCIO
    },
    {
        code: SectorCode.AGROPECUARIA,
        value: SectorValue.AGROPECUARIA
    },
    {
        code: SectorCode.SERVICIOS_PROF_ART_OFF,
        value: SectorValue.SERVICIOS_PROF_ART_OFF
    },
    {
        code: SectorCode.EXCEPCIONES,
        value: SectorValue.EXCEPCIONES
    }
]

export enum TypeCostSpentCode {
    GASTO_VENTA_SIN_DONACION = "1",
    GASTO_ADMINISTRACION_SIN_DONACION = "2",
    GASTO_FINANCIEROS_SIN_DONACION = "3",
    COSTO_ARTICULOS_PRODUCIDOS_COMPRADOS_IMPORTACIONES_INTERNACIONES = "4",
    COSTO_ARTICULOS_PRODUCIDOS_COMPRADOS_INTERNO = "5",
    COSTO_INDIRECTOS_FABRICACION = "6",
    MANO_DE_OBRA = "7",
    EXCEPCIONES = "9"
}

export enum TypeCostSpentValue {
    GASTO_VENTA_SIN_DONACION = "Gasto de Venta sin Donación",
    GASTO_ADMINISTRACION_SIN_DONACION = "Gasto de Administración sin Donación",
    GASTO_FINANCIEROS_SIN_DONACION = "Gastos Financieros sin Donación",
    COSTO_ARTICULOS_PRODUCIDOS_COMPRADOS_IMPORTACIONES_INTERNACIONES = "Costo Artículos Producidos/Comprados Importaciones/Internaciones",
    COSTO_ARTICULOS_PRODUCIDOS_COMPRADOS_INTERNO = "Costo Artículos Producidos/Comprados Interno",
    COSTO_INDIRECTOS_FABRICACION = "Costo Indirectos de Fabricación",
    MANO_DE_OBRA = "Mano de obra",
    EXCEPCIONES = "Excepciones (Instituciones publicas, no inscritos a IVA, operaciones no deducibles para renta, entre otros.)"
}

export const TypeCostSpents = [
    {
        code: TypeCostSpentCode.GASTO_VENTA_SIN_DONACION,
        value: TypeCostSpentValue.GASTO_VENTA_SIN_DONACION
    },
    {
        code: TypeCostSpentCode.GASTO_ADMINISTRACION_SIN_DONACION,
        value: TypeCostSpentValue.GASTO_ADMINISTRACION_SIN_DONACION
    },
    {
        code: TypeCostSpentCode.GASTO_FINANCIEROS_SIN_DONACION,
        value: TypeCostSpentValue.GASTO_FINANCIEROS_SIN_DONACION
    },
    {
        code: TypeCostSpentCode.COSTO_ARTICULOS_PRODUCIDOS_COMPRADOS_IMPORTACIONES_INTERNACIONES,
        value: TypeCostSpentValue.COSTO_ARTICULOS_PRODUCIDOS_COMPRADOS_IMPORTACIONES_INTERNACIONES
    },
    {
        code: TypeCostSpentCode.COSTO_ARTICULOS_PRODUCIDOS_COMPRADOS_INTERNO,
        value: TypeCostSpentValue.COSTO_ARTICULOS_PRODUCIDOS_COMPRADOS_INTERNO
    },
    {
        code: TypeCostSpentCode.COSTO_INDIRECTOS_FABRICACION,
        value: TypeCostSpentValue.COSTO_INDIRECTOS_FABRICACION
    },
    {
        code: TypeCostSpentCode.MANO_DE_OBRA,
        value: TypeCostSpentValue.MANO_DE_OBRA
    },
    {
        code: TypeCostSpentCode.EXCEPCIONES,
        value: TypeCostSpentValue.EXCEPCIONES
    }
]