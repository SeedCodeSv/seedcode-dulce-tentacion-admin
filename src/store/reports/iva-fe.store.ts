import { create } from "zustand";

import { IvaFeStore } from "./types/iva-fe.types.store";

import { get_annexes_iva } from "@/services/reports/iva-fe.service";

export const useIvaFeStore = create<IvaFeStore>((set) => ({
    annexes_iva: [],
    loading_annexes_fe: false,
    onGetAnnexesIva(branchId, month, year) {
        set({ loading_annexes_fe: true });
        get_annexes_iva(branchId, month, year).then((res) => {
            const { data } = res;

            const format = data.salesByDay.flat(2).map(sale => {
                return sale.sales.map(sl => ({
                    ...sl,
                    resolution: sale.resolution,
                    type: sale.type,
                    series: sale.series,
                    typeVoucher: sale.typeVoucher,
                    code: sale.code,
                }));
            });

            const flatted = format
                .flat(1)
                .sort((a, b) => new Date(a.currentDay).getTime() - new Date(b.currentDay).getTime());

            set({ annexes_iva: flatted, loading_annexes_fe: false });
        }).catch(() => set({ annexes_iva: [], loading_annexes_fe: false }));
    },
}));