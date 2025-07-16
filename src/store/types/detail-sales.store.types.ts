import { Sale } from "@/types/detail-sales.types"

export interface IDetailSalesStore {
    detailSales: Sale | null,
    loadingSale: boolean, 
    getDetailSales: (id: number) => void
}