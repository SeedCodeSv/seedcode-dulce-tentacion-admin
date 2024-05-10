import { create } from "zustand";
import { IActionsRolStore } from "./types/actions_rol.store.types";
import {
  get_actions_by_rol_and_view,
  save_action_rol,
} from "../services/actions_rol.service";
import { messages } from "../utils/constants";
import { toast } from "sonner";
import { save_action } from "../services/actions.service";
export const useActionsRolStore = create<IActionsRolStore>((set, get) => ({
  actions_by_view_and_rol: [],
  actions_view: [],
  getActionsByRolView(idRol, idView) {
    get_actions_by_rol_and_view(idRol, idView)
      .then(({ data }) => {
        const actions = data.roleActions.map((action) => action.action.name);
        set((state) => ({ ...state, actions_by_view_and_rol: actions }));
      })
      .catch(() => {
        set((state) => ({ ...state, actions_by_view_and_rol: [] }));
      });
  },
  async OnCreateActionsRol(payload, roleId) {
    const verified = payload.names
      .filter((action) => {
        const actions = get().actions_view.find(
          (ac) => ac.name === action.name
        );
        return actions;
      })
      .map((action) => action.name);

    const not_exit = payload.names
      .filter((action) => {
        const actions = verified.find((ac) => ac === action.name);
        return !actions;
      })
      .map((val) => {
        return {
          name: val.name,
        };
      });

    // if (verified.length > 0) {
    //   const ids = get()
    //     .actions_view.filter((ac) => verified.includes(ac.name))
    //     .map((dt) => {
    //       return { id: dt.id };
    //     });
    // }
    if (not_exit.length > 0) {
      try {
        const data = await save_action({ ...payload, names: not_exit });

        const roles_action = {
          roleId,
          actionIds: data.data.actionsId.map((dt) => ({ id: dt.id })),
        };
        const res = await save_action_rol(roles_action);
        if (res.data.ok) {
          toast.success(messages.success);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        toast.error(messages.error);
        return false;
      }
    }
    return true;
  },
}));
