import {IBranchProductOrder, IGetBranchProductPaginated } from "./branch_products.types";

export interface ICreateInventoryAdjustment {
  description: string;
  branchId: number;
  userId: number;
  typeInventory: string;
  typeMovement: string;
  detailInventoryAdjustments: DetailInventoryAdjustment[];
}

export interface DetailInventoryAdjustment {
  branchProductId: number;
  remainingStock: number;
  remainingPrice: number;
}

export interface InventaryCreateStore {
  branchProducts: IBranchProductOrder[];
  card_products: IBranchProductOrder[];
  pagination_data: IGetBranchProductPaginated;
  OnGetProductInventoryAdjustament: (
    branch: string,
    supplier?: string,
    product?: string,
    code?: string,
    page?: number,
    limit?: number,
    itemType?: string
  ) => void;
  OnAddProductInventoryAdjustament: (branchProduct: IBranchProductOrder) => void;
  OnDeleteProductInventoryAdjustament: (id: number) => void;
  OnClearProductInventoryAdjustament: () => void;
  setBranchProducts: (branchProducts: IBranchProductOrder[]) => void;
  OnCreateInventoryAdjustment: (data: ICreateInventoryAdjustment) => Promise<{ ok: boolean }>;
  OnCreateRecountStockInventoryAdjustment: (
    data: ICreateInventoryAdjustment
  ) => Promise<{ ok: boolean }>;
}

export interface IPropsInventoryAdjustment {
 isOpen?: boolean;
  closeModal?: () => void;
  branchName?: (name: string) => void;
}
export interface IPropsListInventoryAdjustment {
  branchName: string;
  reloadInventory: (
    branch: string,
    supplier: string,
    product: string,
    code: string,
    page: number,
    limit: number,
    itemType: string
  ) => void;
}
export interface IPropsAddInventoryAdjustment {
  isOpen?: boolean;
  closeModal?: () => void;
  branchName?: (name: string) => void;
}
