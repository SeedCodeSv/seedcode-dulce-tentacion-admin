import { IActionPayload, IAction, GroupedAction, RoleAction } from "../../types/actions.types";
import { RoleViewAction } from "../../types/actions_rol.types";
export interface IActionsRolStore {
  actions_by_view_and_rol: string[];
  actions_view: IAction[];
  actions_roles_grouped: GroupedAction[];
  roleActions: RoleAction[];
  role_view_action: RoleViewAction;
  getActionsByRolView: (idRol: number, idView: number) => void;
  OnCreateActionsRol: (payload: IActionPayload, roleId: number) => Promise<boolean>;
  OnGetActionsRoleList: () => void;
  OnGetActionsByRole: (rol_id: number) => Promise<void>;
  OnGetActionsByRoleReturn: (rol_id: number) => Promise<RoleViewAction | undefined>;
}
