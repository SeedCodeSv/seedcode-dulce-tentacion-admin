import { Role } from './roles.types';
import { IAction, View } from './actions.types';
export interface IActionRol {
  id: number;
  role: Role;
  action: IAction;
  isActive: boolean;
}
export interface IGetActionRolList {
  ok: boolean;
  roleActions: IActionRol[];
  status: number;
}
export interface IAddActionRol {
  roleId: number;
  actionIds: {
    id: number;
  }[];
}
export interface IResponseDataRoleActions {
  ok: boolean;
  roleActions: RoleAction[];
  status: number;
}
export interface RoleAction {
  id: number;
  isActive: boolean;
  action: Action;
  role?: Role;
}

export interface Action {
  id: number;
  name: string;
  isActive: boolean;
  view: View;
  actionId: number;
}

export interface RoleViewAction {
  name: string;
  roleId: number;
  view: { name: string; actions: { name: string }[] }[];
}

export interface IUpdateActions {
  name: string;
  viewId: number;
}

export interface IUpdateActionDto {
  actions: IUpdateActions[];
}
