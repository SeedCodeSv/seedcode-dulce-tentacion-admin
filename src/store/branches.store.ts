import { create } from "zustand";
import { IBranchStore } from "./types/branch.store";
import {
  get_branches_pagination,
  patch_branch,
  save_branch,
  delete_branch,
  get_branches_list,
} from "../services/branches.service";
import { messages } from "../utils/constants";
import { toast } from "sonner";

export const useBranchesStore = create<IBranchStore>((set, get) => ({
  branches_paginated: {
    branches: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  branch_list: [],
  async getBranchesList() {
    return get_branches_list()
      .then(({ data }) => {
        set((state) => ({ ...state, branch_list: data.branches }));
      })
      .catch(() => {
        set((state) => ({ ...state, branch_list: [] }));
      });
  },
  saveBranchesPaginated: (data) => set({ branches_paginated: data }),
  getBranchesPaginated: (page, limit, name, phone, address) => {
    get_branches_pagination(page, limit, name, phone, address)
      .then((branches) => set({ branches_paginated: branches.data }))
      .catch(() => {
        set({
          branches_paginated: {
            branches: [],
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
  async postBranch(payload) {
    try {
      const res = await save_branch(payload);
      get().getBranchesPaginated(1, 8, "", "", "");
      toast.success(messages.success);
      return res.data.ok;
    } catch {
      toast.error(messages.error);
      return false;
    }
  },
  async patchBranch(paylad, id) {
    try {
      const res = await patch_branch(paylad, id);
      get().getBranchesPaginated(1, 8, "", "", "");
      toast.success(messages.success);
      return res.data.ok;
    } catch {
      toast.error(messages.error);
      return false;
    }
  },
  async deleteBranch(id) {
    try {
      const { data } = await delete_branch(id);
      get().getBranchesPaginated(1, 8, "", "", "");
      toast.success(messages.success);
      return data.ok;
    } catch {
      toast.error(messages.error);
      return false;
    }
  },
}));
