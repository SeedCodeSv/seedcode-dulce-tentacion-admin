import { create } from "zustand";
import { IBranchStore } from "./types/branch.store";
import {
  get_branches_pagination,
  patch_branch,
  save_branch,
  delete_branch,
  get_branches_list,
  disable_branch,
  get_branch_products
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
  limit: 5,
  loading: false,
  active: 1 as 1 | 0,
  branch_products_list: [],
  async getBranchesList() {
    return get_branches_list()
      .then(({ data }) => {
        set((state) => ({ ...state, branch_list: data.branches }));
      })
      .catch(() => {
        set((state) => ({ ...state, branch_list: [] }));
      });
  },
  async disableBranch(id, state) {
    return disable_branch(id, state)
      .then(({ data }) => {
        get().getBranchesPaginated(1, get().limit, "", "", "", get().active);
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.error(messages.error);
        return false;
      })
  },
  saveBranchesPaginated: (data) => set({ branches_paginated: data }),
  getBranchesPaginated: (page, limit, name, phone, address, active = 1) => {
    set({ loading: true, limit, active });
    get_branches_pagination(page, limit, name, phone, address, active)
      .then((branches) =>
        set({ branches_paginated: branches.data, loading: false })
      )
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
          loading: false,
        });
      });
  },
  async postBranch(payload) {
    return save_branch(payload)
      .then((result) => {
        get().getBranchesPaginated(1, get().limit, "", "", "", get().active);
        toast.success(messages.success);
        return result.data.ok;
      })
      .catch(() => {
        toast.error(messages.error);
        return false;
      });
  },
  async patchBranch(payload, id) {
    return patch_branch(payload, id)
      .then(({ data }) => {
        get().getBranchesPaginated(1, get().limit, "", "", "", get().active);
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.error(messages.error);
        return false;
      });
  },
  async deleteBranch(id) {
    try {
      const { data } = await delete_branch(id);
      get().getBranchesPaginated(1, get().limit, "", "", "", get().active);
      toast.success(messages.success);
      return data.ok;
    } catch {
      toast.error(messages.error);
      return false;
    }
  },
  async getBranchProducts(id, name, category) {
      await get_branch_products(id, name, category)
      .then(({ data }) => {
        set({ branch_products_list: data.branchProducts });
      }).catch(() => {
        set({ branch_products_list: [] });
        toast.error(messages.error);
      })
  }
}));
