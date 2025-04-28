import { create } from "zustand";

import { get_contract_types } from "../services/contract_type.service";

import { IContractTypeStore } from "./types/contract_type.store.types";

export const useContractTypeStore = create<IContractTypeStore>((set) => ({
    contract_type: [],
    GetContractType() {
        get_contract_types()
        .then(({ data }) => set({ contract_type: data.contractTypes }))
            .catch(() => {
                set({ contract_type: [] });
            });
    },

}))