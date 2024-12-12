import { SaleAnnexe } from "@/store/types/iva-ccfe.types";

export interface AnnexeCCFEStore{
    annexes_iva_ccfe: SaleAnnexe[],
    loading_annexes_iva_ccfe: boolean
    onGetIvaAnnexesCcf: (branchId: number, startDate: string) => void
}