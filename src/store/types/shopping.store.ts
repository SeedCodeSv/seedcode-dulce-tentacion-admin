
import { IPagination } from "@/types/global.types"
import { IGetShopping, ShoppingDetails, ShoppingReport } from "@/types/shopping.types"

export interface IShoppingStore {
  annexes_list: ShoppingReport[];
  shoppingList: IGetShopping[]
  pagination_shopping: IPagination
  loading_shopping: boolean;
  loading: boolean;
  shopping_excluded_subject: ShoppingReport[],
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
  onGetShoppingExcludedSubject: (transmitterId: number, month: string, year: number) => void
  onGetAnnexesShoppingByMonth: (transmitterId: number, month: string, year: number) => void;

}
