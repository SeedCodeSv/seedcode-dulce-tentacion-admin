export interface CreditoCuerpoDocumento {
    numItem: number;
    tipoItem: number;
    uniMedida: number;
    numeroDocumento: any;
    cantidad: number;
    codigo: string ;
    codTributo: any;
    descripcion: string;
    precioUni: number ;
    montoDescu: number ;
    ventaNoSuj: number ;
    ventaExenta: number ;
    ventaGravada: number 
    tributos: string[] | null;
    psv: number ;
    noGravado: number 
    ivaItem: number 
}