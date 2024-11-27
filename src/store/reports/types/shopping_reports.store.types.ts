import { ShoppingReport } from "@/types/shopping.types";

export interface IShoppingReportStore {
    loading: boolean;
    shoppings: ShoppingReport[];
    annexes_list: ShoppingReport[];
    onGetAnnexes: (branch: number, startDate: string, endDate: string) => void;
    onGetShoppingReports: (branch: number, month: string) => void;
}