import { create } from "zustand";
import { ICorrelativesDteStore } from "./types/correlatives_dte.store.types";
import { get_correlatives_dte } from "../services/correlatives_dte.service";

export const useCorrelativesDteStore = create<ICorrelativesDteStore>(() => ({
    async getCorrelativesByDte(transmitter_id, dte) {
        const result = await get_correlatives_dte(transmitter_id, dte);

        if (result) return result.data.correlativo
    },
}))