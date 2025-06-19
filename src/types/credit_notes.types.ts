import { IPagination } from "./global.types";
import { Sale } from "./sales.types";

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

export interface SaleId {
    id: number;
}
export interface IGetAllCreditNotes {
    ok: boolean;
    status: number;
    credits: CreditContingence[];
}

export interface Credit {
    id: number;
    pathJson: string;
    sale: SaleId
}

export interface IGetCreditNote {
    ok: boolean;
    status: number;
    notaDeCredito: Credit;
}

export interface NotaCredito {
    id: number;
    numeroControl: string;
    codigoGeneracion: string;
    fecEmi: string;
    horEmi: string;
    sale: SaleId;
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

export interface CreditNote extends Sale {
    sale: Sale;
    saleId: number;
}

export interface IGetListCreditNotes extends IPagination {
    credit_notes: CreditNote[]
}

