export interface CreditoPagos {
    id?: number;
    codigo: string;
    montoPago: number;
    referencia: string;
    plazo?: any;
    periodo?: any;
    ventaId: number
}