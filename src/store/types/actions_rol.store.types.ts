import { IActionPayload, IAction, GroupedAction, RoleAction } from "../../types/actions.types";
export interface IActionsRolStore {
  actions_by_view_and_rol: string[];
  actions_view: IAction[];
  actions_roles_grouped: GroupedAction[];
  roleAction: RoleAction[];

  getActionsByRolView: (idRol: number, idView: number) => void;
  OnCreateActionsRol: (payload: IActionPayload, roleId: number) => Promise<boolean>;
  OnGetActionsRoleList: () => void;
}
