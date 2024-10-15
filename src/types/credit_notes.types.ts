export interface CreditContingence {
    id: number;
    numeroControl: string;
    codigoGeneracion: string;
    tipoDte: string;
    fecEmi: string;
    horEmi: string;
    selloRecibido: string;
    selloInvalidacion?: any;
    sello: boolean;
    totalNoSuj: string;
    ivaPerci1: string;
    descuNoSuj: string;
    totalLetras: string;
    ivaRete1: string;
    subTotalVentas: string;
    subTotal: string;
    reteRenta: string;
    descuExenta: string;
    totalDescu: string;
    descuGravada: string;
    totalGravada: string;
    montoTotalOperacion: string;
    totalExenta: string;
    pathPdf: string;
    pathJson: string;
    isActivated: boolean;
    saleId: number;
    salesStatusId: number;
}

export interface IGetAllCreditNotes {
    ok: boolean;
    status: number;
    credits: CreditContingence[];
}

export interface Credit {
    id: number;
    pathJson: string;
    sale: {
        id: number;
    }
}

export interface IGetCreditNote {
    ok: boolean;
    status: number;
    notaDeCredito: Credit;
}

export interface Sale {
    id: number;
}

export interface NotaCredito {
    id: number;
    numeroControl: string;
    codigoGeneracion: string;
    fecEmi: string;
    horEmi: string;
    sale: Sale;
}

export interface IRecentCreditNotes {
    ok: boolean;
    status: number;
    notaCredito: NotaCredito[];
}

export interface AnnulationSalePayload {
    nameResponsible: string;
    nameApplicant: string;
    docNumberResponsible: string;
    docNumberApplicant: string;
    typeDocResponsible: string;
    typeDocApplicant: string;
}
