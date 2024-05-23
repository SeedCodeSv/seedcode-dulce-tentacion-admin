import { create } from 'zustand';
import { IActionsRolStore } from './types/actions_rol.store.types';
import {
  get_actions_by_rol_and_view,
  get_actions_by_role,
  get_actions_role,
  save_action_rol,
} from '../services/actions_rol.service';
import { messages } from '../utils/constants';
import { toast } from 'sonner';
import { save_action } from '../services/actions.service';
import { formatActionsRole } from '../utils';
import { RoleViewAction } from '../types/actions_rol.types';
import { get_views } from '../services/views.service';
import { get_rolId } from '../storage/localStorage';
export const useActionsRolStore = create<IActionsRolStore>((set, get) => ({
  actions_by_view_and_rol: [],
  actions_view: [],
  actions_roles_grouped: [],
  role_view_action: {} as RoleViewAction,
  roleActions: [],
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
        const actions = get().actions_view.find((ac) => ac.name === action.name);
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
    if (not_exit.length > 0) {
      try {
        const data = await save_action({ ...payload, names: not_exit });

        const roles_action = {
          roleId,
          actionIds: data.data.actionsId.map((dt) => ({ id: dt.id })),
        };
        const res = await save_action_rol(roles_action);
        if (res.data.ok) {
          const roleId = get_rolId() ?? 0;
          get().OnGetActionsByRole(roleId);
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

  async OnGetActionsRoleList() {
    get_actions_role()
      .then(async ({ data }) => {
        if (data.ok) {
          set((state) => {
            return {
              ...state,
              actions_roles_grouped: formatActionsRole(data.roleActions),
            };
          });
        } else {
          set((state) => {
            return {
              ...state,
              actions_roles_grouped: [],
            };
          });
        }
      })
      .catch(() => {
        set((state) => {
          return {
            ...state,
            actions_roles_grouped: [],
          };
        });
      });
  },

  async OnGetActionsByRole(rol_id) {
    return get_actions_by_role(rol_id)
      .then(async ({ data }) => {
        if (data.ok) {
          set((state) => {
            return {
              ...state,
              actions_roles_grouped: formatActionsRole(data.roleActions),
            };
          });
          const views = await get_views();
          const role = data.roleActions[0].role.name;
          const views_exist = views.data.views
            .map((dt) => {
              const actions = data.roleActions
                .filter((rl) => rl.action.actionId === dt.id)
                .map((dr) => {
                  return { name: dr.action.name };
                });
              return {
                name: dt.name,
                actions: actions,
              };
            })
            .filter((ac) => ac.actions.length > 0);

          set({
            roleActions: data.roleActions,
          });

          if (views_exist !== undefined) {
            const new_eval: RoleViewAction = {
              name: role,
              roleId: rol_id,
              view: views_exist,
            };

            set((state) => {
              return {
                ...state,
                role_view_action: new_eval,
              };
            });

            return new_eval;
          }
          return undefined;
        } else {
          set({
            roleActions: [],
          });
          return undefined;
        }
      })
      .catch(() => {
        set({
          roleActions: [],
        });
        return undefined;
      });
  },

  async OnGetActionsByRoleReturn(rol_id) {
    return get_actions_by_role(rol_id).then(async ({ data }) => {
      const views = await get_views();
      const role = data.roleActions[0].role.name;

      const views_exist = views.data.views
        .map((dt) => {
          const actions = data.roleActions
            .filter((rl) => rl.action.view.id === dt.id)
            .map((dr) => {
              return { name: dr.action.name };
            });

          return {
            name: dt.name,
            actions: actions,
          };
        })
        .filter((ac) => ac.actions.length > 0);

      if (views_exist !== undefined) {
        const new_eval: RoleViewAction = {
          name: role,
          roleId: rol_id,
          view: views_exist,
        };

        return new_eval;
      }
      return undefined;
    });
  },
}));
