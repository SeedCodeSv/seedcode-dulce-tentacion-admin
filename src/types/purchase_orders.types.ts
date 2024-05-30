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