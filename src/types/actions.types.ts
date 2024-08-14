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
}
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

export interface ICraeteView {
  name: string;
  type: string;
}
export interface CreateViewDto {
  views: ICraeteView[];
}
export interface Root {
  ok: boolean;
  views: View[];
  status: number;
}

export interface View {
  name: string;
  type: string;
  id: number;
  isActive: boolean;
}
