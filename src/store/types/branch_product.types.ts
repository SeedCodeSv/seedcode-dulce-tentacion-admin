import { BranchProduct } from "../../types/branch_products.types";
import { IPagination } from "../../types/global.types";

export interface IBranchProductStore {
    branch_products: BranchProduct[],
    pagination_branch_products: IPagination,
    getPaginatedBranchProducts: (branchId: number, page?: number, limit?: number, name?: string, code?: string) => void
}