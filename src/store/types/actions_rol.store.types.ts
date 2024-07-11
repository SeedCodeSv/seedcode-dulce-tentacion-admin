import { IActionPayload, IAction, GroupedAction } from '../../types/actions.types';
import { RoleAction, RoleViewAction } from '../../types/actions_rol.types';
export interface IActionsRolStore {
  actions_by_view_and_rol: string[];
  actions_view: IAction[];
  actions_roles_grouped: GroupedAction[];
  
  loading_actions: boolean;
  roleActions: RoleAction[];
  role_view_action: RoleViewAction;
  getActionsByRolView: (idRol: number, idView: number) => void;
  OnCreateActionsRol: (payload: IActionPayload, roleId: number) => Promise<boolean>;
  OnGetActionsRoleList: () => void;
  OnGetActionsByRole: (rol_id: number) => Promise<RoleViewAction | undefined>;
  OnGetActionsByRoleReturn: (rol_id: number) => Promise<RoleViewAction | undefined>;
}
