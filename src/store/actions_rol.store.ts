import { create } from "zustand";
import { IActionsRolStore } from "./types/actions_rol.store.types";
import { get_actions_by_rol_and_view } from "../services/actions_rol.service";
export const useActionsRolStore = create<IActionsRolStore>((set) => ({
  actions_by_view_and_rol: [],
  getActionsByRolView(idRol, idView) {
    get_actions_by_rol_and_view(idRol, idView)
      .then(({ data }) => {
        const actions = data.roleActions.map((action) => action.action);
        set((state) => ({ ...state, box_list: actions }));
      })
      .catch(() => {
        set((state) => ({ ...state, actions_by_view_and_rol: [] }));
      });
  },
}));
