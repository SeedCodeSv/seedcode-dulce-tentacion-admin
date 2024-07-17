import { create } from 'zustand';
import { IBranchStore } from './types/branch.store';
import {
  get_branches_pagination,
  patch_branch,
  save_branch,
  delete_branch,
  get_branches_list,
  disable_branch,
  get_branch_products,
  save_active_branch,
} from '../services/branches.service';
import { messages } from '../utils/constants';
import { toast } from 'sonner';

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
  branch_product_Paginated: {
    branchProducts: [],
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
  loading_branch_product: false,
  getBranchesList() {
    return get_branches_list()
      .then(({ data }) => {
        set((state) => ({ ...state, branch_list: data.branches }));
      })
      .catch(() => {
        set((state) => ({ ...state, branch_list: [] }));
      });
  },
  disableBranch(id, state) {
    return disable_branch(id, state)
      .then(({ data }) => {
        get().getBranchesPaginated(1, get().limit, '', '', '', get().active);
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.error(messages.error);
        return false;
      });
  },
  saveBranchesPaginated: (data) => set({ branches_paginated: data }),
  getBranchesPaginated: (page, limit, name, phone, address, active = 1) => {
    set({ loading: true, limit, active });
    get_branches_pagination(page, limit, name, phone, address, active)
      .then((branches) => set({ branches_paginated: branches.data, loading: false }))
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
  postBranch(payload) {
    return save_branch(payload)
      .then((result) => {
        get().getBranchesPaginated(1, get().limit, '', '', '', get().active);
        toast.success(messages.success);
        return result.data.ok;
      })
      .catch(() => {
        toast.error(messages.error);
        return false;
      });
  },
  patchBranch(payload, id) {
    return patch_branch(payload, id)
      .then(({ data }) => {
        get().getBranchesPaginated(1, get().limit, '', '', '', get().active);
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
      get().getBranchesPaginated(1, get().limit, '', '', '', get().active);
      toast.success(messages.success);
      return data.ok;
    } catch {
      toast.error(messages.error);
      return false;
    }
  },
  async getBranchProducts(id, page, limit, name, category, code) {
    set({ loading_branch_product: true });
    await get_branch_products(id, page, limit, name, category, code)
      .then(({ data }) => {
        set({
          branch_products_list: data.branchProducts,
          branch_product_Paginated: {
            total: data.total,
            totalPag: data.totalPag,
            currentPag: data.currentPag,
            nextPag: data.nextPag,
            prevPag: data.prevPag,
            status: data.status,
            ok: data.ok,
          },
          loading_branch_product: false
        });
      })
      .catch(() => {
        set({
          branch_products_list: [],
          branch_product_Paginated: {
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 0,
            ok: false
          },
          loading_branch_product:false
        });
      });
  },
  saveActiveBranch(id, state) {
    save_active_branch(id, state).then(({ data }) => {
      if (data.ok) {
        get().getBranchesPaginated(1, get().limit, '', '', '', get().active);
        toast.success(messages.success);
      } else {
        toast.error(messages.error);
      }
    });
  },
}));
