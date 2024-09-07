
import { IPagination } from "@/types/global.types"
import { IGetShopping } from "@/types/shopping.types"

export interface IShoppingStore {
    shoppingList: IGetShopping[]
    pagination_shopping: IPagination
    loading_shopping: boolean;
    getPaginatedShopping: (id: number, page?: number, limit?: number, fecha?: string, segundaFecha?: string, branchId?: string) => void
}
