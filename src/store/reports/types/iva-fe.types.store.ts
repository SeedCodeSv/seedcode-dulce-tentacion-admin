import { IvaSale } from "@/store/types/iva-fe.types";

export interface IvaFeStore {
    annexes_iva: IvaSale[],
    loading_annexes_fe: boolean
    onGetAnnexesIva: (branchId: number, month: string, year: number) => void
}