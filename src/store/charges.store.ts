import { create } from "zustand"
import { IChargesStore } from "./types/charges.store.types";
import { activate_charge, create_charge, delete_charge, get_charges_list, get_charges_paginated, update_charge } from "../services/charges.service";
import { toast } from "sonner";
import { messages } from "../utils/constants";


export const useChargesStore = create<IChargesStore>((set, get) => ({
  charges: [],
  loading: false,
  charges_paginated: {
    charges: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  getChargesList() {
    get_charges_list()
      .then(({ data }) => set({ charges: data.charges }))
      .catch(() => {
        set({ charges: [] });
      });
  },
  getChargesPaginated: (page: number, limit: number, name: string, active = 1) => {
    set({ loading: true });
    get_charges_paginated(page, limit, name, active)
      .then((categories) =>
        set({ charges_paginated: categories.data, loading: false })
      )
      .catch(() => {
        set({
          loading: false,
          charges_paginated: {
            charges: [],
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 404,
            ok: false,
          },
        });
      });
  },
  postCharge(name) {
    create_charge({name})
      .then(() => {
        get().getChargesPaginated(1, 5, '', 1);
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  patchCharge(name, id) {
    update_charge({ name }, id)
      .then(() => {
        get().getChargesPaginated(1, 5, '', 1);
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.success);
      });
  },
  deleteCharge: async (id) => {
    return await delete_charge(id).then((res) => {
      get().getChargesPaginated(1, 5, '', 1);
      toast.success(messages.success);
      return res.data.ok;
    }).catch(() => {
      toast.error(messages.error);
      return false;
    });
  },
  async activateCharge(id) {
    try {
      const res = await activate_charge(id);
      get().getChargesPaginated(1, 5, '', 1);
      toast.success(messages.success);
      return res.data.ok;
    } catch {
      toast.error(messages.error);
      return false;
    }
  }

}));
