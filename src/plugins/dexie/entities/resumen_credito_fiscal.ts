export interface CreditoResumen {
    id?: number
    totalNoSuj: number | string;
    totalExenta: number | string;
    totalGravada: number | string;
    subTotalVentas: number | string;
    descuNoSuj: number | string;
    descuExenta: number | string;
    descuGravada: number | string;
    porcentajeDescuento: number | string;
    totalDescu: number | string;
    tributos: string;
    subTotal: number | string;
    ivaRete1: number | string;
    reteRenta: number | string;
    ivaPerci1: number | string;
    montoTotalOperacion: number | string;
    totalNoGravado: number | string;
    totalPagar: number | string;
    totalLetras: string;
    saldoFavor: number | string;
    condicionOperacion: number;
    pagosId: string;
    numPagoElectronico: any;
    totalIva: number | string;
    ventaId: number
}