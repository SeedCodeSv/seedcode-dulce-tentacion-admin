import { create } from "zustand";


import { IvaAnulatedStore } from "./types/iva-anulados.types.store.";

import { get_annexes_iva_anulated } from "@/services/reports/iva-anulados.service";

export const useIvaAnulatedStore = create<IvaAnulatedStore>((set) => ({
    annexes_anulated: [],
    loading: false,
    onGetAnnexesIvaAnulated(branchId, month, year) {
        set({ loading: true });
        get_annexes_iva_anulated(branchId, month, year).then((res) => {
            const { data } = res;
         
            set({ annexes_anulated: data.anulateds, loading: false });
        }).catch(() => set({ annexes_anulated: [], loading: false }));
    },
}));