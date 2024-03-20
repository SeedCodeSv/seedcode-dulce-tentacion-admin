import { create } from "zustand";
import { IUseRolesStore } from "./types/roles.store";
import { get_all_roles } from "../services/roles.service";

export const useRolesStore = create<IUseRolesStore>((set) => ({
  roles_list: [],
  getRolesList() {
    get_all_roles()
      .then((res) => {
        set({ roles_list: res.data.roles });
      })
      .catch(() => {
        set({ roles_list: [] });
      });
  },
}));
