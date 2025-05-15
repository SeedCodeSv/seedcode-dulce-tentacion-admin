import { BranchProduct } from "./branch_products.types";
import { IPagination } from "./global.types";

export interface PurchaseOrderPayload {
    supplierId: number;
    branchId: number;
    total: number;
    branchProducts: IBranchProductOrder[];
}

export interface IBranchProductOrder {
    branchProductId: number;
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

export interface PurchaseOrderDetail {
    id: number;
    date: string;
    time: string;
    total: string;
    state: boolean;
    isActive: boolean;
    supplierId: number;
    branchId: number;
}

export interface ProductDetail {
    id: number;
    name: string;
    description: string;
    tipoItem: string;
    tipoDeItem: string;
    uniMedida: string;
    unidaDeMedida: string;
    code: string;
    isActive: boolean;
    categoryProductId: number;
}

export interface BranchProductDetail {
    id: number;
    stock: number;
    price: string;
    priceA: string;
    priceB: string;
    priceC: string;
    minimumStock: number;
    costoUnitario: string;
    isActive: boolean;
    product: ProductDetail;
    branchId: number;
    productId: number;
    supplierId: number;
}

export interface DetailPurchaseOrder {
  isNew?: boolean;
  name?: string;
  id: number;
  quantity: number;
  cost: number;
  sellingPrice: string;
  iva: boolean;
  subtractedProduct: string;
  isActive: boolean;
  purchaseOrder: PurchaseOrder;
  branchProduct: BranchProduct;
  branchProductId: number;
  purchaseOrderId: number;
}
export interface IGetDetailsPurchaseOrder {
    ok: boolean;
    detailPurchaseOrders: DetailPurchaseOrder[];
    status: number;
}

export interface DetailPurchaseOrderPrice extends DetailPurchaseOrder {
    price: number;
}

export interface DetailOrderItems {
    name: string,
    price: number,
    quantity: number,
    orderId: number,
    total: number,
    isNew: boolean,
    productId: number,
    iva: boolean
    branchProductId?:number;
    branchProduct?: BranchProduct
}

export interface UpdatePurchaseItems {
  branchProductId: number;
  quantity: number;
  cost: number;
  unitPrice: number;
  isNew: boolean;
}

export interface IAddProductOrder {
  branchProductId: number;
  quantity: number;
  stock? : number
}