
import { IPagination } from "@/types/global.types"
import { IGetShopping, ShoppingDetails, ShoppingReport } from "@/types/shopping.types"

export interface IShoppingStore {
    shoppingList: IGetShopping[]
    pagination_shopping: IPagination
    loading_shopping: boolean;
    shopping_details: ShoppingDetails | undefined,
    search_params: {
      page: number;
      limit: number;
      startDate: string;
      endDate: string;
      branchId: string
    }
    getShoppingDetails: (id: number) => void
    getPaginatedShopping: (id: number, page?: number, limit?: number, fecha?: string, segundaFecha?: string, branchId?: string) => void
    shopping_by_months: ShoppingReport[],
    onGetShoppingByMonth: (transmitterId: number, month: string, year: number) => void
}
