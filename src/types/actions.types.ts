import { Role } from './roles.types';
import { IView } from './view.types';
export interface IAction {
  id: number;
  name: string;
  isActive?: boolean;
  view: IView;
  actionId: number;
}
export interface IActionPayload {
  names: { name: string }[];
  viewId: number;
}
export interface ICreateRoleActionPayload {
  actionIds: { id: number }[];
  roleId: number;
};
export interface IGetActionRol {
  ok: boolean;
  actionsId: IAction[];
}

export interface RoleAction {
  id: number;
  isActive: boolean;
  action: IAction;
  role: Role;
}

export interface GroupedAction {
  role: string;
  view: string;
  action: string[];
}
