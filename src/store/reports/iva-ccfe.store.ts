import { create } from "zustand";
import { AnnexeCCFEStore } from "./types/iva-ccfe.types.store";
import { get_annexes_iva_ccfe } from "@/services/reports/iva-ccfe.service";

export const useIvaCcfeStore = create<AnnexeCCFEStore>((set) => ({
    loading_annexes_iva_ccfe: false,
    annexes_iva_ccfe: [],
    // onGetIvaAnnexesCcf(branchId, startDate, endDate) {
    //     get_annexes_iva_ccfe(branchId, startDate, endDate).then((res) => {
    //         const { data } = res;
    //         set({ annexes_iva_ccfe: data.sales, loading_annexes_iva_ccfe: false });
    //     }).catch(() => set({ annexes_iva_ccfe: [], loading_annexes_iva_ccfe: false }));
    // },
    onGetIvaAnnexesCcf(branchId, month, year) {
        set({ loading_annexes_iva_ccfe: true }); // Aquí activamos el estado de carga
        get_annexes_iva_ccfe(branchId, month, year)
            .then((res) => {
                const { data } = res;
                set({ annexes_iva_ccfe: data.sales, loading_annexes_iva_ccfe: false });
            })
            .catch(() => set({ annexes_iva_ccfe: [], loading_annexes_iva_ccfe: false }));
    },

}));