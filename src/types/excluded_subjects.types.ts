import { SaleEmployee } from "./sales.types";
import { Supplier } from "./supplier.types";

export interface IExcludedSubjects {
    id: number;
    subject: Supplier;
    subjectId: number;
    box: Box;
    boxId: number;
    employee: SaleEmployee;
    employeeId: number;
    status: SalesStatus;
    statusId: number;
    numeroControl: string;
    codigoGeneracion: string;
    tipoDte: string;
    pathJson: string;
    condicionOperacion: number;
    fecEmi: string;
    horEmi: string;
    selloRecibido: string;
    selloInvalidacion: string;
    sello: boolean;
    totalCompra: number;
    descu: number;
    totalDescu: string;
    ivaRete1: number;
    subTotal: string;
    reteRenta: string;
    totalPagar: string;
    totalLetras: string;
    isActive: boolean;
}

export interface SalesStatus {
    id: number;
    name: string;
    isActive: boolean;
}

export interface Box {
    id: number;
    start: string;
    end: string;
    totalSales: string;
    totalExpense: string;
    totalIva: string;
    date: string;
    time: string;
    isActive: boolean;
    pointOfSaleId: number;
}

export interface IGetExcludedSubjectPaginated {
    ok: boolean;
    excludedSubjects: IExcludedSubjects[];
    total: number;
    totalPag: number;
    currentPag: number;
    nextPag: number;
    prevPag: number;
    status: number;
}

// Para anular

export interface IExSubject {
    id: number
    pathJson: string
    excludedSj: {
        id: number
    }
}
export interface IGetExcludedSubject {
    ok: boolean;
    status: number;
    excludedSubjects: IExSubject;
}


export interface IRecentExcludedSubject {
    ok: boolean;
    status: number;
    excludedSubjects: IExcludedSubjects[];
}

export interface IGetExcludedSubjectDetails {
    ok: boolean;
    message: string;
    excludedSubject: IExcludedSubjects;
}

export interface Detail {
    id: number;
    tipoItem: number;
    cantidad: number;
    uniMedida: number;
    descripcion: string;
    codigo?: string;
    precioUni: number;
    montoDescu: number;
    compra: number;
    excludedSubject: IExcludedSubjects;
    excludedSubjectId: number;
    pathPdf: string;
    pathJson: string;
    isActive: boolean;
    isEdited: boolean;
}

export interface AnnulationExcludedSubjectPayload {
    nameResponsible: string;
    nameApplicant: string;
    docNumberResponsible: string;
    docNumberApplicant: string;
    typeDocResponsible: string;
    typeDocApplicant: string;
}

export interface IGetContingenceExcludedSubjects {
    ok: boolean;
    status: number;
    excludedSubject: IExcludedSubjects[];
}