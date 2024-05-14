export interface CuerpoDocumento {
    id?: number;
    numItem: number
    tipoItem: number
    uniMedida: number
    numeroDocumento: string;
    cantidad: number
    codigo: string;
    codTributo: string;
    descripcion: string
    precioUni: number
    montoDescu: number
    ventaNoSuj: number
    ventaExenta: number
    ventaGravada: number
    ivaItem: number
    tributos: string
    psv: number
    noGravado: number
}
