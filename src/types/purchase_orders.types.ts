import { IPagination } from "./global.types";

export interface PurchaseOrderPayload {
    supplierId: number;
    branchId: number;
    total: number;
    branchProducts: IBranchProductOrder[];
}

export interface IBranchProductOrder {
    productId: number;
    quantity: number;
    unitPrice: number;
}

export interface Supplier {
    id: number;
    nombre: string;
    nombreComercial: string;
    nrc: string;
    nit: string;
    tipoDocumento: string;
    numDocumento: string;
    codActividad: string;
    descActividad: string;
    bienTitulo: string;
    telefono: string;
    correo: string;
    isActive: boolean;
    esContribuyente: boolean;
    direccionId: number;
    transmitterId: number;
}

export interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    isActive: boolean;
    transmitterId: number;
}

export interface PurchaseOrder {
    id: number;
    date: string;
    time: string;
    total: string;
    state: boolean;
    isActive: boolean;
    supplier: Supplier;
    branch: Branch;
    supplierId: number;
    branchId: number;
}

export interface IGetPurchaseOrdersPagination extends IPagination {
    purchaseOrders: PurchaseOrder[];
}