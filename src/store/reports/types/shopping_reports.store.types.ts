import { ShoppingReport } from "@/types/shopping.types";

export interface IShoppingReportStore {
    loading: boolean;
    shoppings: ShoppingReport[];
    onGetShoppingReports: (branch: number, month: string) => void;
}