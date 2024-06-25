import { create } from "zustand";
import { IChargesStore } from "./types/charges.store.types";
import { get_charges_list } from "../services/charges.service";

export const useChargeStore = create<IChargesStore>((set) => ({
    charges: [],
    getChargesList() {
        get_charges_list()
        .then(({ data }) => {
            set({ charges: data.charges });
          })
         .catch(() => {
            set({ charges: [] });
        });
    },
    // getChargesPaginated (page: number, limit: number, name: string, active?: number) {},
    // postCharge (name: string) {},
    // patchCharge(name: string, id: number) {},
    // deleteCharge (id: number) {},
    // activateCharge (id: number) {},
}))