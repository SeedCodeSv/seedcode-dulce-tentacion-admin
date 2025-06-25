import { Sale } from "@/types/sales.types";

export interface IvaAnulatedStore {
    annexes_anulated: Sale[],
    loading: boolean
    onGetAnnexesIvaAnulated: (branchId: number, month: string, year: number) => void
}