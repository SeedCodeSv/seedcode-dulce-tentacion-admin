import { BranchProduct, ICartProduct } from "../../types/branch_products.types";
import { IPagination } from "../../types/global.types";

export interface IBranchProductStore {
    branch_products: BranchProduct[],
    pagination_branch_products: IPagination,
    cart_products: ICartProduct[],
    getPaginatedBranchProducts: (branchId: number, page?: number, limit?: number, name?: string, code?: string) => void,
    addProductCart: (product: BranchProduct) => void
    deleteProductCart: (id: number) => void
    emptyCart: () => void
    onPlusQuantity: (id: number) => void
    onMinusQuantity: (id: number) => void
    onRemoveProduct: (id: number) => void
}